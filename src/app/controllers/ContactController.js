const ContactsRepository = require('../repositories/ContactsRepository')
const isValidUUID = require('../utils/isValidUUID')

class ContactController {
   async index(request,response)
   {
    const { orderBy } = request.query;
    const contacts = await ContactsRepository.findAll(orderBy);

    response.json(contacts)
   }

   async show(request,response)
   {
     const {id} = request.params;

     if(!isValidUUID(id))
     {
        return response.status(400).json({ error: 'contato invalido'});
     }

     const contact = await ContactsRepository.findById(id);
     if(!contact)
     {
      return response.status(404).json({error:'contato nao encontrado'});
     }
     response.json(contact);

   }

   async store(req,res)
   {
    const { name,email,phone,category_id}=req.body

    if(!name)return res.status(400).json({error:'o nome é necessario'});

    if(category_id && !isValidUUID(category_id))
     {
        return response.status(400).json({ error: 'categoria invalida'});
     }


     if(email)
     {
      const contactExists = await ContactsRepository.findByEmail(email);

      if(contactExists)
      {
       return res.status(400).json({error:'email ja esta em uso'});
      }
     }

     const contact = await ContactsRepository.create({
      name,
      email,
      phone,
      category_id: category_id || null,
     })

     res.json(contact);
  }

    async update(req,res)
   {
     const { id } = req.params;
     const { name,email,phone,category_id } = req.body;

     if(!isValidUUID(id))
     {
        return response.status(400).json({ error: 'contato invalido'});
     }

     
     if(!name)return res.status(400).json({error:'o nome é necessario'});
     
    if(email)
    { 
      const contactExists= await ContactsRepository.findById(id)
      if(!contactExists)
      {
       return res.status(404).json({error:'usuario nao encontrado'});
      }
    }
     
     const contactByEmail = await ContactsRepository.findByEmail(email);
     
     if(contactByEmail && contactByEmail.id !== id)
     {
       return res.status(400).json({error:'email ja em uso'});
      }

     const contact = await ContactsRepository.update(id,{
      name,
      email: email || null,
      phone,
      category_id: category_id || null
    });
     res.json(contact);
   }

   async delete(request,response)
   {
    const {id} = request.params;
    if(!isValidUUID(id))
    {
       return response.status(400).json({ error: 'contato invalido'});
    }
    await ContactsRepository.delete(id);
    response.sendStatus(204);
   }
}

module.exports = new ContactController();
