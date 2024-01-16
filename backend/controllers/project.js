const Project = require('../models/project');
const Milestone = require('../models/milestone');

exports.getMyProjects = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const bids = await Project.getProjectsByUserId(user_id);
        res.json(bids);
    } catch (error) {
        next(error);
    }
};

exports.getProjectMilestones = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const milestone = new Milestone();
        const milestones = await milestone.getMilestonesByProjectId(projectId);
        res.json(milestones);
    } catch (error) {
        next(error);
    }
};

exports.createMilestone = async (req, res, next) => {
    try {
        const project_id = req.params.id;
        const { name, description, due_date } = req.body;

        const milestone = new Milestone();
        const finalMilestoneDueDate = await milestone.getDueDateOfFinalMilestone(project_id);
        const mostRecentMilestoneDueDate = await milestone.getDueDateOfMostRecentMilestone(project_id);

        if (mostRecentMilestoneDueDate && (new Date(due_date) >= new Date(finalMilestoneDueDate) || new Date(due_date) <= new Date(mostRecentMilestoneDueDate))) {
            return res.status(400).json({ code: "ERROR", message: 'Invalid Date' });
        }

        const finalOrderNumber = await milestone.getOrderNumberOfFinalMilestone(project_id);
        await milestone.incrementOrderNumber(finalOrderNumber);
        const newMilestone = await milestone.create({
            project_id: project_id,
            name: name,
            description: description,
            due_date: due_date,
            status: 1,
            order_number: finalOrderNumber,
        });

        res.status(200).json({ code: "SUCCESS", message: 'Milestone created successfully', milestone: newMilestone });
    } catch (error) {
        next(error);
    }
}

exports.updateMilestoneData = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, due_date } = req.body;
        const milestone = new Milestone();

        const currentMilestone = await milestone.get(id);
        const finalMilestoneDueDate = await milestone.getDueDateOfFinalMilestone(currentMilestone.project_id);
        const mostRecentMilestoneDueDate = await milestone.getDueDateOfMostRecentMilestone(currentMilestone.project_id);

        if (due_date && mostRecentMilestoneDueDate && (new Date(due_date) >= new Date(finalMilestoneDueDate) || new Date(due_date) <= new Date(mostRecentMilestoneDueDate))) {
            return res.status(400).json({ code: "ERROR", message: 'Invalid Date' });
        }

        let updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (due_date !== undefined) updateData.due_date = due_date;
        updateData.updated_at = new Date();

        await milestone.update(id, updateData);

        res.status(200).json({ code: "SUCCESS", message: 'Milestone updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.completeMilestone = async (req, res, next) => {
    try {
        const { id } = req.body;
        const milestone = new Milestone();

        const milestones = await milestone.getAllOrderedByOrderNumber();

        if (Number(milestones[0].id) !== Number(id)) {
            return res.status(400).json({ code: "ERROR", message: 'This milestone cannot be completed yet.' });
        }

        await milestone.updateStatus(id, 2);

        res.status(200).json({ code: "SUCCESS", message: 'Milestone completed successfully' });
    } catch (error) {
        next(error);
    }
}

exports.deleteMilestone = async (req, res, next) => {
    try {
        const { id } = req.params;
        const milestone = new Milestone();
        const orderNumber = await milestone.getOrderNumber(id);

        await milestone.delete(id);
        await milestone.decrementOrderNumbers(orderNumber);
        res.status(200).json({ code: "SUCCESS", message: 'Milestone deleted successfully' });
    } catch (error) {
        next(error);
    }
};