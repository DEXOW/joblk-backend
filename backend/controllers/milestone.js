const db = require('../utils/db_connection');
const Milestone = require('../models/milestone');
const Job = require('../models/job');
const uploadFile = require('../utils/upload_image');

exports.createMilestone = async (req, res, next) => {
    try {
        const { jobId, name, description, due_date, priority } = req.body;
        const job = await Job.findById(jobId);

        if (job.status == 4) {
            return res.status(400).json({ code: "ERROR", message: 'Project has been completed' });
        }

        if (!jobId || !name || !description || !due_date || !priority) {
            return res.status(400).json({ code: "ERROR", message: 'Missing required fields' });
        }

        const milestone = new Milestone();
        const finalMilestoneDueDate = await Milestone.getDueDateOfFinalMilestone(jobId);
        const mostRecentMilestoneDueDate = await Milestone.getDueDateOfMostRecentMilestone(jobId);
        const newDueDate = new Date(due_date).getTime();

        if (mostRecentMilestoneDueDate && (newDueDate >= finalMilestoneDueDate || newDueDate <= mostRecentMilestoneDueDate)) {
            return res.status(400).json({ code: "ERROR", message: 'Due date must be between the most recent and final milestone due dates' });
        }

        const finalOrderNumber = await Milestone.getOrderNumberOfFinalMilestone(jobId);
        await Milestone.incrementOrderNumber(finalOrderNumber);

        const newMilestone = await milestone.create({
            job_id: jobId,
            name: name,
            description: description,
            due_date: due_date,
            priority: priority,
            status: 1,
            order_number: finalOrderNumber,
        });

        res.status(200).json({ code: "SUCCESS", message: 'Milestone created successfully' });
    } catch (error) {
        next(error);
    }
}

exports.getJobMilestones = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (job == null) {
            return res.status(404).json({ error: 'Job not found' });
        }

        let milestones = await new Milestone().findByJobId(jobId);
        milestones = milestones.map(milestone => {
            const { job_id, budget, payment_status, status, created_at, updated_at, ...everythingElse } = milestone;
            return everythingElse;
        });
        res.status(200).send(milestones);
    } catch (error) {
        next(error);
    }
}
exports.getJobMilestonesBudgetBid = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const bid_value = req.query.bid_value;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        let milestones = await new Milestone().findByJobId(jobId);
        const totalPriority = milestones.reduce((total, milestone) => total + milestone.priority, 0);

        milestones = milestones.map(milestone => {
            const { job_id, payment_status, status, created_at, updated_at, ...everythingElse } = milestone;
            const budget = (bid_value / totalPriority) * everythingElse.priority;
            return { ...everythingElse, budget };
        });

        res.status(200).send(milestones);
    } catch (error) {
        next(error);
    }
}

exports.getMilestoneContent = async (req, res, next) => {
    try {
        const milestone_id = req.params.id;
        const currentMilestone = await Milestone.findById(milestone_id);

        if (currentMilestone == null) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const milestoneContent = await Milestone.getMilestoneContent(milestone_id);

        res.status(200).json(milestoneContent);
    } catch (error) {
        next(error);
    }

}

exports.updateMilestone = async (req, res, next) => {
    try {
        const user = req.user.id;
        const { id } = req.params;
        const { name, description, due_date, priority } = req.body;
        const milestone_id = id;
        const milestone = await Milestone.findById(milestone_id);
        const updatedFields = {};

        if (milestone == null) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const job = await Job.findById(milestone.job_id);

        if (user != job.client_id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (milestone.status == 2) {
            return res.status(400).json({ error: 'Milestone is closed for changes' });
        }

        const finalMilestoneDueDate = new Date(await Milestone.getDueDateOfFinalMilestone(milestone.job_id)).getTime();
        const milestoneDueDateTimestamp = new Date(milestone.due_date).getTime();

        if (due_date && !(milestoneDueDateTimestamp === finalMilestoneDueDate)) {
            const mostRecentMilestoneDueDate = await Milestone.getDueDateOfMostRecentMilestone(milestone.job_id);
            const newDueDateTimestamp = new Date(due_date).getTime();
            if (mostRecentMilestoneDueDate && (newDueDateTimestamp >= finalMilestoneDueDate || newDueDateTimestamp <= mostRecentMilestoneDueDate)) {
                return res.status(400).json({ error: 'Due date must be between the most recent and final milestone due dates' });
            } else {
                updatedFields.due_date = due_date;
            }
        }

        if (name) {
            updatedFields.name = name;
        }

        if (description) {
            updatedFields.description = description;
        }

        if (priority) {
            updatedFields.priority = priority;
        }

        db.query(`UPDATE milestones SET ? WHERE id = ?`, [updatedFields, id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (results.affectedRows === 0) {
                return res.status(400).json({ error: 'Milestone not found' });
            }
            if (results.changedRows > 0) {
                return res.status(200).json({ message: 'Milestone updated successfully' });
            } else {
                return res.status(200).json({ message: 'No changes made' });
            }
        });
    } catch (error) {
        next(error);
    }
}

exports.completeMilestone = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        const milestone = new Milestone();
        const currentMilestone = await milestone.get(id);

        if (!currentMilestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const job = await Job.findById(currentMilestone.job_id);

        if (job.client_id != user_id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const milestones = await Milestone.findByJobId(currentMilestone.job_id);
        console.log(milestones);

        if (milestones.some(m => m.order_number < currentMilestone.order_number && m.status !== 3)) {
            return res.status(400).json({ code: "ERROR", message: 'This milestone cannot be completed yet.' });
        }

        await milestone.updateStatus(id, 3);

        res.status(200).json({ code: "SUCCESS", message: 'Milestone completed successfully' });
    } catch (error) {
        next(error);
    }
}

exports.uploadMilestoneContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const milestone = new Milestone();
        const currentMilestone = await milestone.get(id);

        if (!currentMilestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const file1 = req.files[0];
        const file2 = req.files[1];
        const file3 = req.files[2];
        const file4 = req.files[3];
        const file5 = req.files[4];

        const files = [file1, file2, file3, file4, file5];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file) {
                const uploadUrl = await uploadFile(file);
                db.query('INSERT INTO milestone_content (milestone_id, upload_reference) VALUES (?, ?)', [id, uploadUrl], (err, results) => {
                    if (err) {
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                });
            }
        }
        let content = {};
        if (file1) {
            content.file1 = file1;
        }
        if (file2) {
            content.file2 = file2;
        }
        if (file3) {
            content.file3 = file3;
        }
        if (file4) {
            content.file4 = file4;
        }
        if (file5) {
            content.file5 = file5;
        }
        res.status(200).json({ code: "SUCCESS", message: 'Milestone content uploaded successfully', content });
    } catch (error) {
        next(error);
    }
}

exports.deleteMilestone = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        const milestone = new Milestone();
        const currentMilestone = await milestone.get(id);

        if (!currentMilestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const job = await Job.findById(currentMilestone.job_id);

        if (job.client_id != user_id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (currentMilestone.status >= 2) {
            return res.status(400).json({ error: 'Milestone is closed for changes' });
        }

        const milestones = await Milestone.findByJobId(currentMilestone.job_id);
        milestones.sort((a, b) => a.order_number - b.order_number);

        if (milestones[milestones.length - 1].id === currentMilestone.id) {
            return res.status(400).json({ error: 'The last milestone cannot be deleted' });
        }

        await milestone.delete(id);

        res.status(200).json({ code: "SUCCESS", message: 'Milestone deleted successfully' });
    } catch (error) {
        next(error);
    }
}