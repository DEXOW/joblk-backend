const Milestone = require('../models/milestone');
const Job = require('../models/job');

exports.createMilestone = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { jobId, name, description, due_date, priority } = req.body;
        const job = await Job.findById(userId);

        if (job.client_id != userId) {
            return res.status(404).json({ error: 'Job not found' });
        }

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
        const userId = req.user.id;
        const jobId = req.params.id;
        const job = await Job.findById(userId);

        if (job.client_id != userId) {
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