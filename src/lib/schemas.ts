import { z } from 'zod'

export const eventoSchema = z.object({
  titulo: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  descripcion: z.string().max(2000).optional(),
  fecha: z.string().min(1),
  lugar: z.string().min(1).max(200),
  aforo: z.number().int().min(1).max(100000),
  precio: z.number().min(0).max(10000),
  publicado: z.boolean(),
})

export const mensajeLeidoSchema = z.object({
  id: z.string().uuid(),
  leido: z.boolean(),
})

export const galeriaSchema = z.object({
  url: z.string().url(),
  descripcion: z.string().max(500).nullable().optional(),
  evento_id: z.string().uuid().nullable().optional(),
  orden: z.number().int().min(0).optional(),
})

export const galeriaDeleteSchema = z.object({
  id: z.string().uuid(),
})

export const eventoUpdateSchema = eventoSchema.extend({
  id: z.string().uuid(),
})

export const eventoDeleteSchema = z.object({
  id: z.string().uuid(),
})