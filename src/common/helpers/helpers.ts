import { ConflictException } from "@nestjs/common";
const bcrypt = require('bcrypt');

export async function cifrarCadena (cadena: string = '') {
    try {
      const saltRounds = 10;
      const hash = await bcrypt. hash(cadena, saltRounds);
      return hash;
    } catch (err) {
      throw new Error('Error al encriptar la cadena');
    }
  };
  

  export async function isCadenasIguales (cadena: string = '', cadenaCifrada: string = '') {
    try {
      const match = await bcrypt.compare(cadena, cadenaCifrada);
      return match
    } catch (err) {
      throw new Error('Error al comparar cadenas');
    }
  };


export function handleException(err) {

    switch (err?.code) {
      case 11000:
        throw new ConflictException(`URL ya existente ${JSON.stringify(err.keyValue)}`)
    }
    throw err;
  }