import express from 'express';
import { PrismaClient } from '@prisma/client';
import { carSchema } from '../schemas/carSchema';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - model
 *         - year
 *         - brandId
 *         - ownerId
 *       properties:
 *         id:
 *           type: integer
 *         model:
 *           type: string
 *         year:
 *           type: integer
 *         brandId:
 *           type: integer
 *         ownerId:
 *           type: integer
 *         brand:
 *           $ref: '#/components/schemas/Brand'
 *         owner:
 *           $ref: '#/components/schemas/Owner'
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
 * /cars:
 *   get:
 *     summary: Lista todos os carros com marca e proprietário
 *     responses:
 *       200:
 *         description: Lista de carros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/', async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      include: { brand: true, owner: true },
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Busca um carro por ID com marca e proprietário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.get('/:id', async (req, res) => {
  try {
    const car = await prisma.car.findUnique({
      where: { id: Number(req.params.id) },
      include: { brand: true, owner: true },
    });

    if (!car) return res.status(404).json({ error: 'Car not found' });

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Cria um novo carro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Carro criado
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.post('/', async (req, res) => {
  try {
    const parsed = carSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const car = await prisma.car.create({ data: parsed.data });
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Atualiza um carro existente
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
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Carro atualizado
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.put('/:id', async (req, res) => {
  try {
    const parsed = carSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);

    const car = await prisma.car.update({
      where: { id: Number(req.params.id) },
      data: parsed.data,
    });

    res.json(car);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Remove um carro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carro removido
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
router.delete('/:id', async (req, res) => {
  try {
    await prisma.car.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Car deleted' });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
