import express from 'express'
import UserController from '../controllers/user.controller.js'


export class UserRoute extends express.Router{
    constructor() {
        super();
        this.userController = new UserController()

        this.post('/popular', this.userController.createUser)
        this.get('/:id?', this.userController.getUsers) //PASA EL ID COMO QUERY, ES OPCIONAL
        this.post('/', this.userController.addUser)
        this.put('/:id', this.userController.updateUser)
        this.delete('/:id', this.userController.deleteUser)
    }
}