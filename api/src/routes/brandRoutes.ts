import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { brandSchema } from '../schemas/brandSchema';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *         name:
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
 * /brands:
 *   get:
 *     summary: Lista todas as marcas
 *     tags: [Brand]
 *     responses:
 *       200:
 *         description: Lista de marcas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', async (req, res) => {
  try {
    const brands = await prisma.brand.findMany();
    res.json(brands);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Busca uma marca por ID
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marca encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id', async (req, res) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Cria uma nova marca
 *     tags: [Brand]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Marca criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/', async (req, res) => {
  try {
    const parsed = brandSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const brand = await prisma.brand.create({ data: parsed.data });
    res.status(201).json(brand);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /brands/{id}:
 *   put:
 *     summary: Atualiza uma marca existente
 *     tags: [Brand]
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
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       200:
 *         description: Marca atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id', async (req, res) => {
  try {
    const parsed = brandSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const brand = await prisma.brand.update({
      where: { id: Number(req.params.id) },
      data: parsed.data,
    });
    res.json(brand);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /brands/{id}:
 *   delete:
 *     summary: Remove uma marca
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marca removida
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
    await prisma.brand.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
export const qualquercoisa:any = 10