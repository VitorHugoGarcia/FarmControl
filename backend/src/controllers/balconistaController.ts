import { Request, Response } from 'express';
import { prisma } from '../prisma.js'; 

export const cadastrarBalconista = async (req: Request, res: Response) => {
    try {
        // 1. CAPTURA DOS DADOS (Alterado para CPF maiúsculo aqui)
        const { nome, email, senha, CPF } = req.body;

        // 2. VALIDAÇÃO DOS CAMPOS
        if (!nome || !email || !senha || !CPF){
            return res.status(400).json({ erro: "Todos os campos são obrigatórios "});
        }

        // 3. VALIDAÇÃO DO FORMATO DO CPF
        if (CPF.length !== 14) {
            return res.status(400).json({ erro: "CPF deve conter exatamente 14 caracteres no formato 000.000.000-00" });
        }

        const temPontosETraco = CPF.charAt(3) === '.' && CPF.charAt(7) === '.' && CPF.charAt(11) === '-';
        if (!temPontosETraco) {
            return res.status(400).json({ erro: "Formato inválido! Insira os pontos e o traço corretamente: 000.000.000-00" });
        }

        // 4. VALIDAÇÃO DE E-MAIL REPETIDO
        const emailExistente = await prisma.balconista.findUnique({
            where: { email }
        });

        if (emailExistente) {
            return res.status(400).json({ erro: "Este e-mail já está cadastrado!" });
        }

        // 5. SALVAMENTO NO BANCO (Agora o CPF bate perfeitamente com o Prisma)
        const novoBalconista = await prisma.balconista.create({
            data: {
                nome,
                email,
                senha,
                CPF 
            }
        });

        return res.status(201).json({
            mensagem: "Balconista cadastrado com sucesso!!",
            dados: novoBalconista
        });
    } catch (error){
        return res.status(500).json({ erro: "Erro interno ao cadastrar balconista", detalhes: error });
    }
}
