import express from 'express';
import http from 'http';
import chalk from 'chalk';
import { AddressInfo } from 'node:net';
import mongoose from 'mongoose';
import env from './env';
import config from './config';
import router from './router';
import db from './database';

/**
 * Clase servidor de la API REST
 */
class Server {
  private app: express.Express;

  private instancia!: http.Server;

  private mongoDB!: mongoose.Connection;

  /**
   * Constructor
   */
  constructor() {
    // Cargamos express como servidor
    this.app = express();
  }

  /**
   * Inicia el Servidor
   * @returns instancia del servidor http Server
   */
  async start() {
    // No arrancamos hasta qye MongoDB esté lista
    this.mongoDB = await db.connect();

    // Le apliacamos la configuracion a nuestro Servidor
    config(this.app);

    // Le aplicamos el enrutamiento
    router(this.app);

    // Nos ponemos a escuchar a un puerto definido en la configuracion
    this.instancia = this.app.listen(env.PORT, () => {
      const address = this.instancia.address() as AddressInfo;
      const host = address.address === '::' ? 'localhost' : address.address; // dependiendo de la dirección asi configuramos
      const { port } = address; // el puerto
      if (process.env.NODE_ENV !== 'test') {
        console.log(chalk.green(`🟢 Servidor API REST escuchando ✅ -> http://${host}:${port}`));
      }
    });
    return this.instancia; // Devolvemos la instancia del servidor
  }

  /**
   * Cierra el Servidor
   */
  close() {
    // Desconectamos MongoDB
    this.mongoDB.close();
    // Desconectamos el socket server
    this.instancia.close();
    if (process.env.NODE_ENV !== 'test') {
      console.log(chalk.grey('⚪️ Servidor parado ❎'));
    }
  }
}

/**
 * Devuelve la instancia de conexión siempre la misma, singleton
 */
const server = new Server();
// Exportamos el servidor inicializado
export default server;

// Si ningun fichero está haciendo un import y ejecutando ya el servidor, lo lanzamos nosotros
if (!module.parent) {
  server.start();
}

process.on('unhandledRejection', (err) => {
  console.log(chalk.red('❌ Custom Error: An unhandledRejection occurred'));
  console.log(chalk.red(`❌ Custom Error: Rejection: ${err}`));
});
