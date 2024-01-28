const db = require('../utils/db_connection');
const Milestone = require('../models/milestone');
const Job = require('../models/job');

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
        const finalMilestoneDueDate = await milestone.getDueDateOfFinalMilestone(jobId);
        const mostRecentMilestoneDueDate = await milestone.getDueDateOfMostRecentMilestone(jobId);
        const newDueDate = new Date(due_date).getTime();

        if (mostRecentMilestoneDueDate && (newDueDate >= finalMilestoneDueDate || newDueDate <= mostRecentMilestoneDueDate)) {
            return res.status(400).json({ code: "ERROR", message: 'Due date must be between the most recent and final milestone due dates' });
        }

        const finalOrderNumber = await milestone.getOrderNumberOfFinalMilestone(jobId);
        await milestone.incrementOrderNumber(finalOrderNumber);

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

        if (due_date) {
            const finalMilestoneDueDate = new Date(await Milestone.getDueDateOfFinalMilestone(milestone.job_id)).getTime();
            const milestoneDueDateTimestamp = new Date(milestone.due_date).getTime();
            const newDueDateTimestamp = new Date(due_date).getTime();

            if (!(newDueDateTimestamp === finalMilestoneDueDate)) {
                const mostRecentMilestoneDueDate = await Milestone.getDueDateOfMostRecentMilestone(milestone.job_id);
                if (mostRecentMilestoneDueDate && (newDueDateTimestamp >= finalMilestoneDueDate || newDueDateTimestamp <= mostRecentMilestoneDueDate)) {
                    return res.status(400).json({ error: 'Due date must be between the most recent and final milestone due dates' });
                }
            }
            
            const mostRecentMilestoneDueDate = await Milestone.getDueDateOfMostRecentMilestone(milestone.job_id);
            const newDueDate = new Date(due_date).getTime();

            if (mostRecentMilestoneDueDate && (newDueDate >= finalMilestoneDueDate || newDueDate <= mostRecentMilestoneDueDate)) {
                return res.status(400).json({ error: 'Due date must be between the most recent and final milestone due dates' });
            }
        }

        if (name) {
            updatedFields.name = name;
        }

        if (description) {
            updatedFields.description = description;
        }

        if (due_date) {
            updatedFields.due_date = due_date;
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