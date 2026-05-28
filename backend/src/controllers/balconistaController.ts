import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cadastrarBalconista = async (req: Request, res: Response) => {
    try {
        //captura dados enviados pelo usuário
        const { nome, email, senha, cpf} = req.body;

        //validação dos campos
        if (!nome || !email || !senha || !cpf){
            return res.status(400).json({ erro: "Todos os campos são obrigatórios "});
        }

        // 3. VALIDAÇÃO DO FORMATO DO CPF (Padrão 000.000.000-00)
        // Verificação 1: O CPF precisa ter exatamente 14 caracteres no total (11 números + 2 pontos + 1 traço)
        if (cpf.length !== 14) {
            return res.status(400).json({ erro: "CPF deve conter exatamente 14 caracteres no formato 000.000.000-00" });
        }

        // Verificação 2: Garante que os pontos e o traço estão nos locais certos
        const temPontosETraco = cpf.charAt(3) === '.' && cpf.charAt(7) === '.' && cpf.charAt(11) === '-';
        if (!temPontosETraco) {
            return res.status(400).json({ erro: "Formato inválido! Insira os pontos e o traço corretamente: 000.000.000-00" });
        }

        // 4. VALIDAÇÃO DE E-MAIL REPETIDO
        const emailExistente = await prisma.balconista.findUnique({
        where: { email }
        });

        const novoBalconista = await prisma.balconista.create({
            data: {
                nome,
                email,
                senha,
                cpf
            }
        });

        return res.status(201).json({
            mensagem: "Balconista cadastrrado com sucesso!!",
            dados: novoBalconista
        });
    } catch (error){
        return res.status(500).json({ erro: "Erros interno ao cadastrar balconista"});
    }
}