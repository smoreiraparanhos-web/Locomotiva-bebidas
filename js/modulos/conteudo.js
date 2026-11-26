/* Conteúdo das janelas de produto e dos artigos. Texto estático, editável aqui. */

export const PRODUTOS = {
  caldeira: {
    nome: 'Caldeira', linha: 'Nº 01 · O clássico da casa', foto: 'img/gar/caldeira.webp', cor: 'radial-gradient(circle at 50% 40%, #e0353a, #9e1520)',
    texto: 'Malte envelhecido em carvalho tostado. Encorpado e caloroso, com doçura de caramelo e um final apimentado. A primeira dose da noite.',
    dados: [['Volume', '750 ml'], ['Teor', '40% vol.'], ['Barril', 'Carvalho tostado']],
    notas: ['Caramelo queimado', 'Carvalho', 'Pimenta-do-reino', 'Casca de laranja'],
    servir: 'Puro, com uma pedra grande de gelo ou em um Old Fashioned com casca de laranja.',
  },
  fornalha: {
    nome: 'Fornalha', linha: 'Nº 02 · Defumado de barril queimado', foto: 'img/gar/fornalha.webp', cor: 'radial-gradient(circle at 50% 40%, #5c1418, #22080a)',
    texto: 'Vidro escuro, barril queimado por dentro até virar brasa. Defumado, seco e de final longo, para quem procura intensidade.',
    dados: [['Volume', '750 ml'], ['Teor', '43% vol.'], ['Barril', 'Queima intensa']],
    notas: ['Turfa', 'Cacau amargo', 'Brasa', 'Couro'],
    servir: 'Puro em copo baixo ou com algumas gotas de água para abrir os aromas.',
  },
  noturno: {
    nome: 'Noturno', linha: 'Nº 03 · Barril único', foto: 'img/gar/noturno.webp', cor: 'radial-gradient(circle at 50% 40%, #f3c27a, #d08a32)',
    texto: 'Engarrafado à mão, um barril por vez. Mais leve e mais claro, com mel, baunilha e fruta madura. Para a última conversa da mesa.',
    dados: [['Volume', '750 ml'], ['Teor', '41% vol.'], ['Barril', 'Único, numerado']],
    notas: ['Mel', 'Baunilha', 'Pera madura', 'Amêndoas'],
    servir: 'Em taça, levemente resfriado, ou como base de um coquetel com espumante.',
  },
  trio: {
    nome: 'Trio de miniaturas', linha: 'Caldeira, Fornalha e Noturno', foto: 'img/card-trio.webp', cheia: true,
    texto: 'As três garrafas da coleção em miniatura, para provar lado a lado e descobrir o seu temperamento favorito.',
    dados: [['Volume', '3 × 50 ml'], ['Ideal para', 'Degustação'], ['Inclui', 'Guia de prova']],
    notas: ['Clássico', 'Defumado', 'Barril único'],
    servir: 'Do mais leve ao mais intenso: Noturno, Caldeira e, por último, Fornalha.',
  },
  kit: {
    nome: 'Kit para presente', linha: 'Caixa preta com detalhes dourados', foto: 'img/cat-presente.webp', cheia: true,
    texto: 'Duas garrafas na caixa de colecionador, com interior de veludo vermelho e a roda Locomotiva gravada em dourado na tampa.',
    dados: [['Garrafas', '2 × 750 ml'], ['Escolha', 'Qualquer dupla'], ['Inclui', 'Cartão escrito à mão']],
    notas: ['Aniversários', 'Datas especiais', 'Presentes corporativos'],
    servir: 'Monte a dupla que combina com quem vai receber e envie com uma mensagem personalizada.',
  },
};

export const ARTIGOS = {
  historia: {
    titulo: 'Nossa história',
    corpo: `<p>Toda cidade do interior teve uma estação onde o trem parava e a noite começava. Era ali, entre o apito e a próxima partida, que as pessoas se encontravam para conversar sem pressa.</p>
<p>A Locomotiva nasceu dessa memória. Escolhemos o símbolo da roda, doze raios e um eixo, porque é tudo o que move a máquina e nada que sobre. É assim que destilamos: alambique de cobre, barril de carvalho e tempo.</p>
<h3>O que não abrimos mão</h3>
<ul><li>Pequenos lotes, para acompanhar cada barril de perto.</li><li>Sem corantes: a cor vem só da madeira.</li><li>Cada garrafa sai quando está pronta, não quando o calendário pede.</li></ul>`,
  },
  barril: {
    titulo: 'Do carvalho ao copo: por que queimamos nossos barris',
    corpo: `<p>Antes de receber o destilado, o interior de cada barril de carvalho passa pelo fogo. A queima carameliza os açúcares da madeira e cria uma camada de carvão que filtra e arredonda o sabor.</p>
<p>Na Caldeira usamos uma tosta média, que entrega caramelo e baunilha. Na Fornalha, a queima vai até a madeira rachar em brasa: é daí que vêm a turfa e o cacau amargo.</p>
<h3>O papel do tempo</h3>
<p>Calor e frio fazem a madeira respirar. A cada estação o destilado entra e sai das fibras do carvalho, ganhando cor e camadas de sabor. Não existe atalho para isso.</p>`,
  },
  fornalha: {
    titulo: 'Conheça a Fornalha, nosso defumado de barril queimado',
    corpo: `<p>A Fornalha é o rótulo mais intenso da casa. Vidro escuro, lacre vermelho e um destilado que passou por barris queimados até a última camada.</p>
<p>No nariz, turfa e couro. Na boca, cacau amargo, brasa e um final seco que demora a ir embora. É o tipo de dose que pede silêncio no primeiro gole.</p>
<h3>Como provar</h3>
<ul><li>Copo baixo, sem gelo, na primeira vez.</li><li>Depois, algumas gotas de água para abrir os aromas.</li><li>Combina com chocolate amargo e carnes defumadas.</li></ul>`,
  },
  receitas: {
    titulo: 'Coquetéis assinatura',
    corpo: `<h3>Old Fashioned Locomotiva</h3>
<ul><li>60 ml de Caldeira</li><li>1 colher (chá) de xarope de açúcar demerara</li><li>2 dashes de bitter aromático</li><li>Casca de laranja</li></ul>
<p>Mexa com gelo no copo misturador, coe sobre uma pedra grande de gelo e perfume com a casca de laranja.</p>
<h3>Brasa e Cacau</h3>
<ul><li>45 ml de Fornalha</li><li>15 ml de vermute rosso</li><li>10 ml de licor de cacau</li></ul>
<p>Mexa com gelo e sirva em taça resfriada. Finalize com raspas de chocolate amargo.</p>
<h3>Última Estação</h3>
<ul><li>40 ml de Noturno</li><li>20 ml de suco de limão-siciliano</li><li>15 ml de mel</li><li>Espumante para completar</li></ul>
<p>Bata os três primeiros com gelo, coe na taça e complete com espumante bem gelado.</p>`,
  },
  servir: {
    titulo: 'Como servir',
    corpo: `<p>Destilados de carvalho mostram mais aromas entre 16 e 18 °C. Gelo demais adormece o sabor; uma única pedra grande derrete devagar e mantém o equilíbrio.</p>
<ul><li><strong>Puro:</strong> copo baixo ou taça tulipa.</li><li><strong>Com gelo:</strong> uma pedra grande, nunca gelo picado.</li><li><strong>Com água:</strong> algumas gotas abrem os aromas, principalmente na Fornalha.</li></ul>`,
  },
  presente: {
    titulo: 'Presentes corporativos',
    corpo: `<p>Montamos kits com a dupla de garrafas que você escolher, caixa de colecionador e cartão escrito à mão. Para pedidos em quantidade, fale com a gente pelo WhatsApp e conte a ocasião.</p>`,
    whats: 'Olá! Quero saber sobre kits de presente corporativo da Locomotiva.',
  },
  moderacao: {
    titulo: 'Consumo responsável',
    corpo: `<p>Destilados são para apreciar devagar. Beba com moderação, alterne com água e nunca dirija depois de beber.</p>
<p>A venda e o consumo de bebidas alcoólicas são proibidos para menores de 18 anos.</p>`,
  },
};
