import express from 'express'
import {
    login,
    student,
    activity,
    section,
    upload
} from '../controllers/list.js'

const router = express.Router()

router.get('/login', login)
router.get('/student', student)
router.get('/activity', activity)
router.get('/section', section)
router.get('/upload', upload)

export default router