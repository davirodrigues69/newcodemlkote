import { firebaseService } from "./firebaseService.js";

// A interface permanece estável para as telas, mas a persistência e a
// autenticação agora são fornecidas pelo projeto Firebase da New Code.
export const platformService = firebaseService;
