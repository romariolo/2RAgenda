import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, specialty } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, specialty, slug },
        });
        
        const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email, slug: newUser.slug };
        res.status(201).json(userResponse);
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'Este e-mail ou slug já está em uso.' });
        } else {
            res.status(500).json({ error: 'Não foi possível criar o usuário.' });
        }
    }
};

export const getUserBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const user = await prisma.user.findUnique({
            where: { slug },
            include: { services: true },
        });

        if (!user) {
            res.status(404).json({ error: 'Profissional não encontrado.' });
            return;
        }
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar profissional.' });
    }
};