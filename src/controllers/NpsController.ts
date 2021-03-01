import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
/*

  1 2 3 4 5 6 7 8 9

  Detratores: 0 - 6
  Passivos: 7 - 8
  Promotores: 9 - 10


  ( Promotores - detratores ) / número de respostas x 100

*/



class NpsController {

  async execute(request: Request, response: Response) {

    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({

      where: { survey_id, value: Not(IsNull()) }

    });


    const detractors = surveysUsers.filter(itemOfSurveysUsers => itemOfSurveysUsers.value <= 6).length;

    const passives = surveysUsers.filter(itemOfSurveysUsers => itemOfSurveysUsers.value === 7 || itemOfSurveysUsers.value === 8).length;

    const promoters = surveysUsers.filter(itemOfSurveysUsers => itemOfSurveysUsers.value === 9 || itemOfSurveysUsers.value === 10).length;

    const totalsAnswers = surveysUsers.length;

    const pmd = promoters - detractors;

    const calculateNPS = ((promoters - detractors) / totalsAnswers) * 100;

    const finalNPS = Number(calculateNPS.toFixed(2));

    return response.status(200).json({

      pmd,
      detractors,
      passives,
      promoters,
      totalsAnswers,
      nps: finalNPS

    });


  }

}

export { NpsController };