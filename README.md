# DASHBOARD PRODUCAO

 -------- EDICAO TECLADO AMERICANO, SERA CORRIGIDO ----------

Este projeto possui o intuito de simular um Dashboard, para acompanhamento de produção em um sistema MES.

![image](https://user-images.githubusercontent.com/67242658/88467214-02cde980-ceab-11ea-8a4b-f00c0c745896.png)
<hr>

## Informacoes 

#### A Tela foi dividida em 3 partes, que possuem informacoes diferentes, sao elas.

###### Informacoes de producao:
   - Estacao de Trabalho.
   - Codigo de Produto sendo produzido.
   - Overal Equipment Efficience da Maquina.
   - Qantidade de SCRAPS
   
###### Resumo de turnos anteriores, para cada turno:
  - Cap 100% (Quantidade total que esta estacao consegue produzir)
  - Dif 100% (Diferenca entre o total produzido e a capacidade 100% da estacao)
  - Prod Plan (O Numero de pecas que foram planejadas a serem produzidas)
  - Dif Plan (Diferenca entre o total produzido e o total planejado)
  - Prod Real (Quantidade de pecas realmente produzidas) 
  
###### Turno Atual:
  - Possui todas as informacoes dos turnos anteriores porem em tempo real.
  - Em um cenario real, esta parte da tela deve atualizar a cada 20 segundos.
  - Parada Principal (Indica qual foi a maior parada de maquina, durante o intervalo de um hora, referente a linha da tabela)
  
  <hr>
  
## Funcionalidades

### Esta tela possui 3 funcionalidades alem das informacoes que ja possui, sao elas: 

###### Novo SCRAP

