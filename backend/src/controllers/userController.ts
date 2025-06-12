import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para criar um novo profissional
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, specialty } = req.body;
    
    // Simples criação de um 'slug' a partir do nome
    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Em um projeto real, você deve fazer o HASH da senha aqui!
        specialty,
        slug
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível criar o usuário.' });
  }
};

// Função para buscar um profissional pelo slug
export const getUserBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const user = await prisma.user.findUnique({
            where: { slug },
            select: { // Seleciona apenas os campos públicos
                name: true,
                specialty: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Profissional não encontrado.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar profissional.' });
    }
};