<script lang="ts" setup></script>

<template>
  <v-row class="py-16">
    <v-container>
      <h2 class="text-h3 text-center mb-12">Perguntas Frequentes</h2>

      <v-expansion-panels variant="popout" class="mb-12">
        <v-expansion-panel>
          <v-expansion-panel-title>
            O Vessel é adequado para pequenos negócios?
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            Sim! O Vessel foi projetado para ser escalável e flexível, atendendo
            desde pequenos bares e restaurantes até grandes empresas de eventos.
            Nossos recursos se adaptam às suas necessidades.
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            Como funciona a integração com meu estoque atual?
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            Você pode cadastrar seus ingredientes e quantidades iniciais
            manualmente. O sistema permite a importação de dados para facilitar
            o processo. Futuramente, planejamos integrações com sistemas de PDV.
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            Meus dados estão seguros?
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            Absolutamente. Utilizamos o Supabase, uma plataforma robusta e
            segura, para armazenar seus dados. Todas as informações são
            criptografadas e protegidas com as melhores práticas de segurança.
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-title>
            Posso testar o Vessel antes de assinar?
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            Sim, oferecemos um período de teste gratuito para que você possa
            explorar todas as funcionalidades e ver como o Vessel pode
            transformar a gestão da sua coquetelaria. Clique em "Comece Agora"
            para iniciar!
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-row>
</template>
