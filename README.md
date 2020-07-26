# DASHBOARD PRODUCAO

Este projeto possui o intuito de simular um dashboard para acompanhamento de produção em um sistema MES.

![image](https://user-images.githubusercontent.com/67242658/88468547-cb1b6d80-cebb-11ea-85af-860527bb1d16.png)
<hr>

# Informações 

##### Informações de produção:
- Estacão de Trabalho.   
- Codigo do produto que esta sendo produzido.
- Overall Equipment Effectiveness da maquina.
- Quantidade de SCRAPS.

![image](https://user-images.githubusercontent.com/67242658/88468557-ed14f000-cebb-11ea-8c65-d76f1f55d665.png)

<hr>


##### Resumo de turnos anteriores, para cada turno:
- Cap 100% (Quantidade total que esta estacão consegue produzir).
- Dif 100% (Diferença entre o total produzido e a capacidade (100%) da estacão).
- Prod Plan (O Número de pecas que foram planejadas a serem produzidas).
- Dif Plan (Diferença entre o total produzido e o total planejado).
- Prod Real (Quantidade de pecas realmente produzidas). 

![image](https://user-images.githubusercontent.com/67242658/88468560-00c05680-cebc-11ea-950a-96cdb194b636.png)

<hr>


##### Turno Atual:
- Possui todas as informações dos turnos anteriores porem em tempo real.
- Em um cenário real, esta parte da tela deve atualizar a cada 20 segundos.
- Parada Principal (Indica qual foi a maior parada de maquina, durante o intervalo de uma hora, referente a linha da tabela).

![image](https://user-images.githubusercontent.com/67242658/88468568-10d83600-cebc-11ea-9c3f-a98f4d706be2.png)

<hr>
  
# Funcionalidades

### O dashboard possui 3 funcionalidades, são elas: 

#### Novo SCRAP

- Ao clicar sobre a informação de SCRAPS, um modal abre, tornando possível inserir um novo SCRAP caso necessário.

![image](https://user-images.githubusercontent.com/67242658/88468596-66144780-cebc-11ea-8acf-3a495388b9a4.png)

- É possível inserir um novo SCRAP pelo seu serial number.

![image](https://user-images.githubusercontent.com/67242658/88468606-952ab900-cebc-11ea-8fec-a1fbcd48f1b4.png)

<hr>

#### Justificativa de Paradas

- As linhas da tabela "turno atual" que possuírem um indicador com uma bola vermelha piscante, possuem paradas ainda não justificadas.

![image](https://user-images.githubusercontent.com/67242658/88468577-26e5f680-cebc-11ea-8368-45f6ea44c1e6.png)

- Ao clicar nesta linha, um modal abre, este modal possui todas as paradas durante tal intervalo de hora.

![image](https://user-images.githubusercontent.com/67242658/88468620-ad023d00-cebc-11ea-82a8-984ba7e8c4c9.png)

- Você pode justificar paradas ou verificar paradas já justificadas.

![image](https://user-images.githubusercontent.com/67242658/88468635-c5725780-cebc-11ea-9c59-9b1a0caa806f.png)
<hr>

#### Divisão de Paradas 

- O botão "Dividir Parada" que pode ser visto no modal de justificativas, possuem a funcionalidade de dividir manualmente uma parada.

![image](https://user-images.githubusercontent.com/67242658/88468639-dae78180-cebc-11ea-98d2-0ef1600a5976.png)

-Ao escolher um horário e salvar, a parada original sera atualizada com a nova data e uma nova parada sera criada com o tempo restante.

![image](https://user-images.githubusercontent.com/67242658/88468788-f81d4f80-cebe-11ea-8556-e3a639fc9073.png)
