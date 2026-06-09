# Logos das marcas

Coloque os arquivos das logos nesta pasta, com **exatamente** estes nomes:

| Marca              | Nome do arquivo            | Status      |
|--------------------|----------------------------|-------------|
| Carmim             | `carmim.png`               | ✅          |
| Carmen Steffens    | `carmen-steffens.png`      | ✅          |
| Yahoo              | `yahoo.png`                | ✅          |
| Colcci             | `colcci.png`               | ✅          |
| Mormaii            | `mormaii.png`              | ✅          |
| Mueller            | `mueller.png`              | ✅          |
| Vonder             | `vonder.png`               | ✅          |
| Ferragens Negrão   | `ferragens-negrao.png`     | ✅          |
| Karsten            | `karsten.svg`              | ✅          |
| Thais Rodrigues    | `thais-rodrigues.png`      | ✅          |
| Artefama           | `artefama.png`             | ✅          |
| TUPER              | `tuper.png`                | ✅          |
| Móveis Campo Largo | `moveis-campo-largo.png`   | ✅          |
| Farma Sesi         | `farma-sesi.png`           | ✅          |
| Via Inox Tramontina| `via-inox-tramontina.png`  | ✅          |
| King 55            | `king-55.png`              | ✅          |
| Havan              | `havan.png`                | ✅          |
| Casa do Marceneiro | `casa-do-marceneiro.png`   | ✅          |

## Dicas

- **Formato:** PNG com fundo transparente (ou SVG — basta trocar a extensão para `.svg` aqui e no `index.html`).
- **Tamanho:** ~600px de largura, proporção horizontal. Não precisa ser perfeito — o site faz ajuste automático.
- **Cor:** o site aplica filtro escala de cinza por padrão e mostra a cor original no hover, então logos coloridas funcionam bem.
- **Nome do arquivo:** tudo minúsculo, sem acento, espaços viram traços.
- **Enquanto não houver arquivo:** o site mostra o nome da marca como texto, sem quebrar o layout.

Para adicionar uma nova marca, edite `bruno-porto/index.html` na seção `id="marcas"` e crie um novo bloco `.brand` apontando para o arquivo da logo.
