import express from 'express';
import { addNews, deleteNews, getNew, getNews, updateNews } from '../Controller/News.controller';
// import { deleteCategory } from '../Controller/Category.controller';

const router =express.Router();

router.get('/get-News',getNews);

router.post('/add-news',addNews);

router.get('/getNew/:news_id',getNew)

router.put('/update-new/:update_id',updateNews);

router.delete('/delete-news/:new_id',deleteNews);

export default router;
