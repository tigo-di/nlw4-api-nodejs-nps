import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { SurveyController } from "./controllers/SurveyController";
import { SendMailController } from "./controllers/SendMailController";

const router = Router();

const sendMailController = new SendMailController();
const userController = new UserController();
const surveyController = new SurveyController();



router.post('/users', userController.create);
router.get('/users', userController.show);
router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.show);

router.post('/sendMail', sendMailController.execute);


router.get('/', (request, response) => (response.json({ 'message': 'UUHH RUuulQ' })));

export { router };