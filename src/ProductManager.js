const fs = require("fs");

class ProductManager {
    constructor(path) {
        this.path = path;
        this.init();
    }

    async init() {
        const products = await this.getProducts()
        await this.setProducts(products);
    }

    async getProducts() {
        try {
            return JSON.parse(fs.readFileSync(this.path));
        } catch {
            return [];
        }
    }

    async setProducts(products) {
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    }

    async addProduct(product) {
        const { title, description, price, img, code, stock } = product
        if (!title || !description || !price || !img || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        const products = await this.getProducts()

        if (products.some(product => product.code === code)) {
            console.error("El codigo debe ser unico");
            return;
        }

        const newProduct = {
            id: (await this.getLastId())+1,
            title,
            description,
            price,
            img,
            code,
            stock
        }
        products.push(newProduct);
        await this.setProducts(products);
    }

    async updateProduct(id, data) {
        const products = await this.getProducts()
        const product = products.find(product => product.id === id);

        if (!product) {
            return;
        }

        product.title = data.title;
        product.description = data.description;
        product.price = data.price;
        product.img = data.img;
        product.code = data.code;
        product.stock = data.stock;

        await this.setProducts(products);
    }

    async getProductById(id) {
        const products = await this.getProducts()
        const product = products.find(product => product.id === id);

        if (!product) {
            console.error("No se ha encontrado el producto.");

        } else {
            console.log("Producto encontrado.", product);
        }
        return product;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id === id);

        if (productIndex < 0) {
            console.error("No se ha encontrado el producto.");
            return;
        }

        products.splice(productIndex, 1);
       await this.setProducts(products);
    }

    async getLastId(){
        const products = await this.getProducts();
        let id = 0;

        products.forEach(product => {
            if(product.id > id ) {
                id = product.id;
            }
        });
        return id;
    }
}

module.exports = ProductManager;
