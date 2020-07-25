# DASHBOARD PRODUCAO

 -------- EDICAO TECLADO AMERICANO, SERA CORRIGIDO ----------

Este projeto possui o intuito de simular um Dashboard, para acompanhamento de produção em um sistema MES.

![image](https://user-images.githubusercontent.com/67242658/88467214-02cde980-ceab-11ea-8a4b-f00c0c745896.png)
<hr>

# Informacoes 

##### Informacoes de producao:
   - Estacao de Trabalho.
   - Codigo de Produto sendo produzido.
   - Overal Equipment Efficience da Maquina.
   - Qantidade de SCRAPS
   
##### Resumo de turnos anteriores, para cada turno:
  - Cap 100% (Quantidade total que esta estacao consegue produzir)
  - Dif 100% (Diferenca entre o total produzido e a capacidade 100% da estacao)
  - Prod Plan (O Numero de pecas que foram planejadas a serem produzidas)
  - Dif Plan (Diferenca entre o total produzido e o total planejado)
  - Prod Real (Quantidade de pecas realmente produzidas) 
  
##### Turno Atual:
  - Possui todas as informacoes dos turnos anteriores porem em tempo real.
  - Em um cenario real, esta parte da tela deve atualizar a cada 20 segundos.
  - Parada Principal (Indica qual foi a maior parada de maquina, durante o intervalo de um hora, referente a linha da tabela)
  
  <hr>
  
# Funcionalidades

### Esta tela possui 3 funcionalidades, sao elas: 

#### Novo SCRAP

- Ao clicar sobre a informacao de SCRAPS, um modal abre, tornando possivel inserir um novo SCRAP caso necessario.

![image](https://user-images.githubusercontent.com/67242658/88467478-f8611f00-cead-11ea-8fa4-72da81d74bb9.png)
<hr>

![image](https://user-images.githubusercontent.com/67242658/88467530-64dc1e00-ceae-11ea-8251-1146adc0b7c7.png)

- Tambem e Possivel inserir um novo SCRAP pelo serial number do produto.

![image](https://user-images.githubusercontent.com/67242658/88467546-8a692780-ceae-11ea-97b3-8f8c610b48aa.png)

<hr>

#### Justificativa de Paradas

- Linhas da tabela turno atual que possuirem um indicador com uma bola vermelha piscante, possuem paradas ainda nao justificadas.

![image](https://user-images.githubusercontent.com/67242658/88467485-0747d180-ceae-11ea-93a3-1528fe273e7a.png)

- Ao clicar nesta linha, um modal abre, este modal possui todas as paradas durante tal intervalo de hora.
- Voce pode justificar paradas ou verificar paradas ja justificadas.

![image](https://user-images.githubusercontent.com/67242658/88467573-a967b980-ceae-11ea-857b-855afd1a81ab.png)
<hr>

#### Divisao de Paradas 

- O botao "Dividir Parada" que pode ser visto no modal de justificativas, possuem a funcionalidade de dividir manualmente uma parada.

![image](https://user-images.githubusercontent.com/67242658/88467601-e633b080-ceae-11ea-949e-1934b6286641.png)
