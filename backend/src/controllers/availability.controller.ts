import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// As outras funções (setAvailability, getMyAvailability) permanecem as mesmas
// ...

// Apenas a função getPublicAvailability precisa ser corrigida
export const getPublicAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.params;
        const { date } = req.query;

        if (!date || typeof date !== 'string') {
            res.status(400).json({ error: "A data é obrigatória." });
            return;
        }

        const professional = await prisma.user.findUnique({
            where: { slug },
            include: { availability: true }
        });

        if (!professional || !professional.availability) {
            res.status(404).json({ error: "Disponibilidade não encontrada para este profissional." });
            return;
        }
        
        const { startTime, endTime } = professional.availability;
        const slotInterval = 60; 

        const busySlots = ['11:00', '14:00']; 
        
        // --- CORREÇÃO AQUI ---
        // Dizemos explicitamente que 'availableSlots' é um array de strings.
        const availableSlots: string[] = []; 
        // --- FIM DA CORREÇÃO ---

        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = endTime.split(':').map(Number);

        const startDate = new Date(`${date}T00:00:00Z`);
        startDate.setUTCHours(startH, startM);

        const endDate = new Date(`${date}T00:00:00Z`);
        endDate.setUTCHours(endH, endM);

        let currentTime = new Date(startDate);
        while (currentTime < endDate) {
            const timeSlot = `${String(currentTime.getUTCHours()).padStart(2, '0')}:${String(currentTime.getUTCMinutes()).padStart(2, '0')}`;
            
            if (!busySlots.includes(timeSlot)) {
                availableSlots.push(timeSlot);
            }
            
            currentTime.setMinutes(currentTime.getMinutes() + slotInterval);
        }

        res.status(200).json(availableSlots);

    } catch (error) {
        console.error("Erro ao buscar disponibilidade:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};

// Cole aqui as outras funções do controller que já estavam funcionando
// (setAvailability e getMyAvailability) para garantir que o arquivo esteja completo.
// ...