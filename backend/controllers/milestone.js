const Milestone = require('../models/milestone');

exports.createMilestone = async (res, req, next) => {
    try {
        const project_id = req.params.id;
        const { name, description, due_date } = req.body;

        // Create a new milestone
        const milestone = new Milestone();

        // Get the order_number of the final milestone for the current project
        const finalOrderNumber = await milestone.getOrderNumberOfFinalMilestone(project_id);

        // Increment the order_number of the final milestone
        await milestone.incrementOrderNumber(finalOrderNumber);

        // Create the new milestone with order_number one less than the updated final milestone's order_number
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