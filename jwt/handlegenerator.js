let jwt = require( 'jsonwebtoken' );
let secret = process.env.SECRET;
const { db } = require("./lib/utils/mongo");
const bcryptjs = require("bcryptjs");
const COLLECTION = "users"
const User = require("./models/user")

async function createUser(user)
{
    const {password} = user;
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password,salt);
    return await User.create(user);
}

async function getUserByUsername(username)
{
    const userByUsername = await User.findOne({ username: username});
    return userByUsername;
}

async function loginUser(user)
{
    const {username, password} = user;
    if (username && password)
    {
        try{
            const user = await getUserByUsername(username);
            if(!user)
            {
                return {
                    success: false,
                    msg: "There is no such username or the password is incorrect",
                }
            }
            const validation = bcryptjs.compareSync(password, user.password)
            if(validation)
            {
                return {
                    success: true,
                    msg: "Access grantes with token."
                }
            }
        }
        catch(error)
        {
            console.log(error)
        }
    }
}




// Clase encargada de la creación del token
class HandlerGenerator {

  async createUser( req, res)
  {
    let username = req.body.username;
    let password = req.body.password;
    
    if( username && password ) {
      createUser(req.body);
      res.sendStatus(200);
    }

  }

  async login( req, res ) {
    
    // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
    let username = req.body.username;
    let password = req.body.password;
    
    // Si se especifico un usuario y contraseña, proceda con la validación
    // de lo contrario, un mensaje de error es retornado
    if( username && password ) {

      // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
      // de lo contrario, un mensaje de error es retornado
      const response = await loginUser(req.body);
      if(response.success) {
        
        // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
        let token = jwt.sign( { username: username },
          secret, { expiresIn: '24h' } );
        
        // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
        res.json( {
          success: true,
          message: 'Authentication successful!',
          token: token
        } );
      } else {
        res.status(403).send(response);
      }

    } else {

      // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
      res.sendStatus(400);
    }

  }

  index( req, res ) {
    
    // Retorna una respuesta exitosa con previa validación del token
    res.json( {
      success: true,
      message: 'Hello ' + req.decoded.username +  ' this is the Index page'
    } );

  }

  async read(req, res)
  {
    let username = req.decoded.username;
    const user = await getUserByUsername(username);
    if(user.permissions.includes("Lectura"))
    {
      res.json( {
        success: true,
        message: 'Hello ' + req.decoded.username +  ' you are allowed to read'
      } );
    }
    else
    {
      res.json( {
        success: false,
        message: 'Hello ' + req.decoded.username +  ' you are NOT allowed to read'
      } );
    }

  }

  async write(req, res)
  {
    let username = req.decoded.username;
    const user = await getUserByUsername(username);
    console.log(user.permissions);
    if(user.permissions.includes("Escritura"))
    {
      res.json( {
        success: true,
        message: 'Hello ' + req.decoded.username +  ' you are allowed to write'
      } );
    }
    else
    {
      res.json( {
        success: false,
        message: 'Hello ' + req.decoded.username +  ' you are NOT allowed to write'
      } );
    }
  }
}

module.exports = HandlerGenerator;