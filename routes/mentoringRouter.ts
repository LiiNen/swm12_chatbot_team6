import express from 'express';
import Controller from '../controllers/mentoringController';

export default express
  .Router()
  .post('/', Controller.create)
  .get('/', Controller.read)
  .put('/', Controller.update)
  .delete('/', Controller.delete)