import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ownerSchema } from '../schemas/ownerSchema';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Owner:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *   responses:
 *     BadRequest:
 *       description: Requisição inválida — dados incorretos ou ausentes
 *     NotFound:
 *       description: Recurso não encontrado
 *     InternalError:
 *       description: Erro interno do servidor
 */

/**
 * @swagger
 * /owners:
 *   get:
 *     summary: Lista todos os proprietários
 *     tags: [Owner]
 *     responses:
 *       200:
 *         description: Lista de proprietários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', async (req, res) => {
  try {
    const owners = await prisma.owner.findMany();
    res.json(owners);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /owners/{id}:
 *   get:
 *     summary: Busca um proprietário por ID
 *     tags: [Owner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proprietário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id', async (req, res) => {
  try {
    const owner = await prisma.owner.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!owner) return res.status(404).json({ error: 'Owner not found' });
    res.json(owner);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /owners:
 *   post:
 *     summary: Cria um novo proprietário
 *     tags: [Owner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Owner'
 *     responses:
 *       201:
 *         description: Proprietário criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/', async (req, res) => {
  try {
    const parsed = ownerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const owner = await prisma.owner.create({ data: parsed.data });
    res.status(201).json(owner);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /owners/{id}:
 *   put:
 *     summary: Atualiza um proprietário existente
 *     tags: [Owner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Owner'
 *     responses:
 *       200:
 *         description: Proprietário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Owner'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id', async (req, res) => {
  try {
    const parsed = ownerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const owner = await prisma.owner.update({
      where: { id: Number(req.params.id) },
      data: parsed.data,
    });
    res.json(owner);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /owners/{id}:
 *   delete:
 *     summary: Remove um proprietário
 *     tags: [Owner]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proprietário removido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/:id', async (req, res) => {
  try {
    await prisma.owner.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Owner deleted' });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

