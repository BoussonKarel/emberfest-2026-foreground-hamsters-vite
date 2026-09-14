import pageTitle from 'ember-page-title/helpers/page-title';
import Scoreboard from 'vite-hamster-wacking/components/scoreboard';

<template>
  {{pageTitle "Vite Hamster Wacking"}}

  <Scoreboard />

  {{outlet}}
</template>
