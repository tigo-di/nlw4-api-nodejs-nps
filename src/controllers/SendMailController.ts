import { Request, Response } from "express";
import { getCustomRepository, RepositoryNotTreeError } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from "path";


class SendMailController {

  async execute(request: Request, response: Response) {

    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user)
      return response.status(400).json({ message: "User not found" });

    const survey = await surveysRepository.findOne({ id: survey_id });

    if (!survey)
      return response.status(400).json({ message: "Survey not found" });


    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({

      where: [{ user_id: user.id, value: null }],
      relations: ["user", "survey"]

    });




    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    if (surveyUserAlreadyExists) {
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyUserAlreadyExists);
    }


    // salvar informações na tabela SurveyUser
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    });


    await surveysUsersRepository.save(surveyUser);




    await SendMailService.execute(
      email,
      survey.title,
      variables,
      npsPath
    );


    return response.json(surveyUser);







  }



}

export { SendMailController }