import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import bcrypt from "bcryptjs";
import { gerarToken } from "../utils/jwt.js";

export const login = async (req: Request, res: Response) => {

    try {

        const { email, senha } = req.body;

        // VALIDAÇÃO
        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios!"
            });
        }

        // BUSCAR USUÁRIO
        const usuario = await prisma.usuario.findUnique({
            where: {
                email
            }
        });

        if (!usuario) {
            return res.status(401).json({
                erro: "Email ou senha inválidos!"
            });
        }

        // COMPARAR SENHA
        const senhaCorreta = await bcrypt.compare(
            senha,
            usuario.senha
        );

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: "Email ou senha inválidos!"
            });
        }

        // GERAR TOKEN
        const token = gerarToken({
            CPF: usuario.CPF,
            cargo: usuario.cargo
        });

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token,
            usuario: {
                CPF: usuario.CPF,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo
            }
        });

    } catch (error) {

        return res.status(500).json({
            erro: "Erro interno no login",
            detalhes: error
        });

    }

};