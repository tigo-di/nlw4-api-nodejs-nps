import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";


//Interface {}
class UserController {

  async create(request: Request, response: Response) {

    const { name, email } = request.body;

    const schema = yup.object().shape({

      name: yup.string().required("Informe o seu nome"),
      email: yup.string().email("Informe o seu email corretamente").required(),

    });

    /*
    
        const isInvalidSchema = !await schema.isValid(request.body);
    
        if (isInvalidSchema)
          return response.status(400).json({ error: "Invalid data. Try again" });
          
          */

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (error) {
      throw new AppError(error);
    }




    const usersRepository = getCustomRepository(UsersRepository);
    const userAlreadyExists = await usersRepository.findOne({
      email
    })

    if (userAlreadyExists) {
      throw new AppError("User already exists!")
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    return response.status(201).json(user);

  }


  async show(request: Request, response: Response) {

    const usersRepository = getCustomRepository(UsersRepository);

    const allUsers = await usersRepository.find();

    if (allUsers)
      return response.status(200).json(allUsers);


  }

}


export { UserController };
