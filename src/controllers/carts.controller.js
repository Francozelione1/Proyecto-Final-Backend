import cartModel from "../models/carts.model.js";
import productoModel from "../models/productos.model.js";


export const getCarts = async (req, res) => {

    try {
        const carts = await cartModel.find()
        res.status(200).send({ resultado: "OK", message: carts })
    }
    catch (e) {
        res.status(400).send({ error: e })
    }

}

export const getCartById = async (req, res) => {

    const { cid } = req.params

    try {
        const cart = await cartModel.findById(cid)
        if(cart){
            return res.status(200).send({ resultado: "OK", message: cart })
        }
        return res.status(404).send({resultado: "Carrito no encontrado"})
    }
    catch (e) {
        res.status(400).send({ error: e })
    }

}

export const getCartUserById = async (req, res) => {
    const { cid } = req.params

    try {
        const cart = await cartModel.findById(cid)
        const productos = await Promise.all(
            cart.products.map(async (item) => {
                const producto = await productoModel.findById(item.idProd);
                return {
                    ...producto._doc, // o simplemente producto, dependiendo de tu ORM
                    quantity: item.quantity
                };
            })
        )
      
        if(cart){
            return res.render('cart', {
                cart: cart,
                productos: productos,
                cartId: cart._id
            })
        }
        return res.status(404).send({resultado: "Carrito no encontrado"})
    }
    catch (e) {
        res.status(400).send({ error: e.message })
    }

}

export const postCart = async (req, res) => {

    try {
        const cart = await cartModel.create({})
        res.status(201).send({ resultado: "OK", message: cart })
    }
    catch (e) {
        res.status(400).send({ error: e })
    }


}

export const postProductCart = async (req, res) => {

    const { cid, id } = req.params
    
    try {
        
        const productoExistente = await productoModel.findById(id)
        
        if (!productoExistente) {
            return res.status(404).send({ resultado: "Producto no encontrado" })
        }
        
        const cart = await cartModel.findById(cid)

        const productoEncontrado = cart.products.find(prod => prod.idProd == id)

        if (productoEncontrado){
            productoEncontrado.quantity += 1
        }
        else{
            cart.products.push({ idProd: id, quantity: 1 })
        }

        const cartUpdated = await cartModel.findByIdAndUpdate(cid, cart, { new: true })

        res.status(200).send({ resultado: "OK", message: cartUpdated })

    }
    catch (e) {
        console.log(e.message);
        res.status(400).send({ error: e.message})
    }

}

export const putProductCart = async (req, res) => {

    const { cid, id } = req.params
    const { quantity } = req.body

    try {

        const cart = await cartModel.findById(cid)

        const productoEncontrado = cart.products.find(prod => prod.idProd == id)

        if (productoEncontrado) {
            productoEncontrado.quantity += quantity
            await cart.save()
            res.status(200).send({ resultado: "OK", message: cart })
        } else {
            res.status(404).send({ resultado: "Producto no econtrado" })
        }

    }
    catch (e) {
        res.status(400).send({ error: e })
    }

}

export const deleteProductCart = async (req, res) => {

    const { cid, pid } = req.params

    try {

        const cart = await cartModel.findById(cid)

        const productoEncontrado = cart.products.find(prod => prod.idProd == pid)

        if (productoEncontrado) {
            cart.products = cart.products.filter(prod => prod.idProd != pid)
            await cart.save()
            res.status(200).send({ resultado: "ok", message: cart })
        } else {
            res.status(404).send({ resultado: "Producto no econtrado" })
        }

    }
    catch (e) {
        res.status(400).send({ message: e.message })
    }


}

export const deleteCart = async (req, res) => {

    const { cid } = req.params

    try {

        const cart = await cartModel.findByIdAndDelete(cid)

        if (cart) {
            res.status(200).send({ resultado: "OK", message: cart })
        } else {
            res.status(404).send({ resultado: "Carrito no encontrado" })
        }

    }
    catch (e) {
        res.status(400).send({ error: e })
    }

}

export const resetCart = async (req, res) => {
    
        const { cid } = req.params
    
        try {
            const cart = await cartModel.findById(cid)
            console.log(cart)
    
            if (cart) {
                cart.products = []
                await cart.save()
                res.status(200).send({ resultado: "ok", message: cart })
            } 
            else {
                res.status(404).send({ resultado: "Carrito no encontrado" })
            }
    
        }
        catch (e) {
            res.status(400).send({ error: e })
        }
}