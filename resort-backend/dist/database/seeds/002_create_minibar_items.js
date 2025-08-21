"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMinibarItems = createMinibarItems;
const connection_1 = __importDefault(require("../connection"));
async function createMinibarItems() {
    const client = await connection_1.default.connect();
    try {
        console.log("🍾 Criando itens do minibar...");
        const existingItems = await client.query("SELECT COUNT(*) FROM minibar_items");
        if (parseInt(existingItems.rows[0].count) > 0) {
            console.log("Itens do minibar já existem. Não criando novamente.");
            return;
        }
        const items = [
            { name: 'Cerveja Heineken', price: 8.50, category: 'Bebidas Alcoólicas' },
            { name: 'Cerveja Stella Artois', price: 9.00, category: 'Bebidas Alcoólicas' },
            { name: 'Vinho Tinto (Garrafa)', price: 45.00, category: 'Bebidas Alcoólicas' },
            { name: 'Vinho Branco (Garrafa)', price: 42.00, category: 'Bebidas Alcoólicas' },
            { name: 'Champagne (Garrafa)', price: 85.00, category: 'Bebidas Alcoólicas' },
            { name: 'Whisky Jack Daniels', price: 25.00, category: 'Bebidas Alcoólicas' },
            { name: 'Vodka Absolut', price: 22.00, category: 'Bebidas Alcoólicas' },
            { name: 'Gin Bombay Sapphire', price: 28.00, category: 'Bebidas Alcoólicas' },
            { name: 'Água Mineral (500ml)', price: 4.50, category: 'Bebidas Não Alcoólicas' },
            { name: 'Refrigerante Coca-Cola', price: 6.00, category: 'Bebidas Não Alcoólicas' },
            { name: 'Refrigerante Pepsi', price: 5.50, category: 'Bebidas Não Alcoólicas' },
            { name: 'Suco de Laranja Natural', price: 8.00, category: 'Bebidas Não Alcoólicas' },
            { name: 'Suco de Maracujá', price: 7.50, category: 'Bebidas Não Alcoólicas' },
            { name: 'Água de Coco', price: 6.50, category: 'Bebidas Não Alcoólicas' },
            { name: 'Energético Red Bull', price: 12.00, category: 'Bebidas Não Alcoólicas' },
            { name: 'Chá Gelado', price: 5.00, category: 'Bebidas Não Alcoólicas' },
            { name: 'Amendoim Torrado', price: 8.00, category: 'Snacks' },
            { name: 'Chips de Batata', price: 7.50, category: 'Snacks' },
            { name: 'Mix de Castanhas', price: 12.00, category: 'Snacks' },
            { name: 'Biscoitos Salgados', price: 6.50, category: 'Snacks' },
            { name: 'Chocolate ao Leite', price: 5.00, category: 'Snacks' },
            { name: 'Chocolate Amargo', price: 6.00, category: 'Snacks' },
            { name: 'Barrinha de Cereal', price: 4.50, category: 'Snacks' },
            { name: 'Pipoca', price: 5.50, category: 'Snacks' },
            { name: 'Escova de Dentes', price: 8.00, category: 'Higiene' },
            { name: 'Pasta de Dente', price: 6.50, category: 'Higiene' },
            { name: 'Sabonete Líquido', price: 12.00, category: 'Higiene' },
            { name: 'Shampoo', price: 15.00, category: 'Higiene' },
            { name: 'Condicionador', price: 15.00, category: 'Higiene' },
            { name: 'Desodorante', price: 18.00, category: 'Higiene' },
            { name: 'Protetor Solar', price: 25.00, category: 'Higiene' },
            { name: 'Preservativo', price: 8.00, category: 'Outros' },
            { name: 'Fósforos', price: 3.00, category: 'Outros' },
            { name: 'Isqueiro', price: 5.00, category: 'Outros' },
            { name: 'Agulha e Linha', price: 4.00, category: 'Outros' },
            { name: 'Band-Aid', price: 6.00, category: 'Outros' },
            { name: 'Aspirina', price: 8.00, category: 'Outros' }
        ];
        for (const item of items) {
            await client.query("INSERT INTO minibar_items (name, price, category) VALUES ($1, $2, $3)", [item.name, item.price, item.category]);
        }
        console.log('✅ Itens do minibar criados com sucesso!');
        console.log(`📦 Total de itens criados: ${items.length}`);
    }
    catch (error) {
        console.error('❌ Erro ao criar itens do minibar:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
if (require.main === module) {
    createMinibarItems()
        .then(() => {
        console.log('✅ Seed de itens do minibar concluído!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('❌ Erro no seed de itens do minibar:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=002_create_minibar_items.js.map