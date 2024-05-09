import { Controller, Param, Query, Get, Header, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import axios from 'axios';

@Controller('desaparecidos')
export class DesaparecidosController {
    @Get()
    @ApiOperation({ summary: 'Lista os desaparecidos através da Policia Civil do Rio Grande do Sul.' })
    @ApiQuery({ name: 'nome', required: false, type: String, description: "Nome da pessoa, opcional." })
    @ApiQuery({ name: 'pagina', required: false, type: String, description: "Número da página, opcional (padrao = 1)." })
    main_route(@Query('nome') person_name?: string, @Query('pagina') page_number?: string) {
        return axios({
            method: 'get',
            url: 'https://www.pc.rs.gov.br/_service/desaparecidos/listhtml?nome=' 
                + (person_name != undefined && person_name.length > 0 ? person_name : "") + 
                '&amdDesaparecimentoInicial=&amdDesaparecimentoFinal=&sexo=&idade=&municipioId=&municipio=&pagina=' + (page_number != undefined ? page_number : "1")
          })
            .then(function (response) {
              const cheerio = require('cheerio');
              const desaparecidos = [];

              const $ = cheerio.load(response.data);

              $('.card-desaparecido').each((index, element) => {
                const nome = $(element).find('.card-desaparecido-nome').text().trim();
                const nascimento = $(element).find('.card-desaparecido-info p:nth-child(2)').text().replace('Nascimento: ', '').trim();
                const desaparecimento = $(element).find('.card-desaparecido-info p:nth-child(3) strong').text().trim();
                const local = $(element).find('.card-desaparecido-info p:nth-child(4) strong').text().trim();
                const imagem = $(element).find('.card-desaparecido-imagem').attr('src');
            
                const desaparecido = {
                    nome,
                    nascimento,
                    desaparecimento,
                    local,
                    imagem
                };
            
                desaparecidos.push(desaparecido);
            });

            return JSON.stringify(desaparecidos, null, 2);
              
              
            });
    }
}