import { Request, Response } from 'express';
import { prisma } from '../prisma.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const cadastrarUsuario = async (req: Request, res: Response) => {
    try {

        const { CPF, nome, email, senha, cargo } = req.body;

        // VALIDAÇÃO
        if (!CPF || !nome || !email || !senha || !cargo) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios!"
            });
        }

        // VALIDA CPF
        if (CPF.length !== 14) {
            return res.status(400).json({
                erro: "CPF deve estar no formato 000.000.000-00"
            });
        }

        const formatoCPF =
            CPF.charAt(3) === '.' &&
            CPF.charAt(7) === '.' &&
            CPF.charAt(11) === '-';

        if (!formatoCPF) {
            return res.status(400).json({
                erro: "Formato de CPF inválido!"
            });
        }
 
        // VERIFICA EMAIL
        const emailExistente = await prisma.usuario.findUnique({
            where: { email }
        });

        if (emailExistente) {
            return res.status(400).json({
                erro: "Email já cadastrado!"
            });
        }

        // CRIPTOGRAFA SENHA
        const senhaHash = await bcrypt.hash(senha, 10);

        // CRIA USUÁRIO
        const novoUsuario = await prisma.usuario.create({
            data: {
                CPF,
                nome,
                email,
                senha: senhaHash,
                cargo
            }
        });

        return res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            usuario: novoUsuario
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro interno do servidor"
        });
    }
};

export const login = async (
    req: Request,
    res: Response
) => {

    try {

        const { email, senha } = req.body;

        // VALIDAÇÃO
        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios!"
            });
        }

        // PROCURA USUÁRIO
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        // USUÁRIO NÃO EXISTE
        if (!usuario) {
            return res.status(401).json({
                erro: "Email ou senha inválidos!"
            });
        }

        // COMPARA SENHA
        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: "Email ou senha inválidos!"
            });
        }

        // GERA TOKEN
        const token = jwt.sign(
            {
                CPF: usuario.CPF,
                cargo: usuario.cargo
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "8h"
            }
        );

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            erro: "Erro interno no login"
        });

    }

};