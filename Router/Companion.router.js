import express from 'express';
import { addCompanion, deleteCompanion, getCompanion, getCompanions, updateCompanion } from '../Controller/Companion.controller';

const router =express.Router();

router.get('/get-companions', getCompanions);

router.post('/add-companion',addCompanion);

router.get('/get-companion/:adoption_id',getCompanion);

router.put('/update-Comapanion/:update_id',updateCompanion);

router.delete('/delete-companion/:adoption_id',deleteCompanion)

export default router;