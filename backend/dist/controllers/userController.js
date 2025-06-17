"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBySlug = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Função para criar um novo profissional
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, specialty } = req.body;
        // Simples criação de um 'slug' a partir do nome
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const newUser = yield prisma.user.create({
            data: {
                name,
                email,
                password, // Em um projeto real, você deve fazer o HASH da senha aqui!
                specialty,
                slug
            },
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Não foi possível criar o usuário.' });
    }
});
exports.createUser = createUser;
// Função para buscar um profissional pelo slug
const getUserBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const user = yield prisma.user.findUnique({
            where: { slug },
            select: {
                name: true,
                specialty: true,
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Profissional não encontrado.' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar profissional.' });
    }
});
exports.getUserBySlug = getUserBySlug;
