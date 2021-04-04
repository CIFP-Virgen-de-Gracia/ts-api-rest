/**
 * ENRUTADOR DE NOTAS
 */

// Cargamos librerías, podemos usar la sitaxis EM6: import { Router } from 'express';
import express from 'express';
import notasController from '../controllers/notas';

// Cargamos el enrutador
const router = express.Router();

// Esta ruta está protegida en todos los elementos:
// - Autenticados

// GET Listar todos los elementos
router.get('/', notasController.findAll);

// GET Obtiene un elemento por por ID
// router.get('/:id', notasController.notaById);

// POST Añadir Elemento.
// router.post('/', notasController.addNota);

// PUT Modifica un elemento por ID.
// router.put('/:id', notasController.editNotaById);

// DELETE Elimina un elemento por ID.
// router.delete('/:id', notasController.deleteNotaById);

// Exprotamos el módulo
export default router;
