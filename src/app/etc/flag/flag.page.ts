import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import "../../number.extensions";

@Component({
  selector: "app-flag",
  templateUrl: "./flag.page.html",
  styleUrls: ["./flag.page.scss"],
})
export class FlagPage implements OnInit {
  readonly TOTAL_TIME = 900; // 15 minutes

  srcFlagList: string[] = [];
  correspondanceMap: Map<number, string> = new Map([
    [0, "France"],
    [1, "Italie"],
    [2, "Roumanie"],
    [3, "Tchad"],
    [4, "Andorre"],
    [5, "Moldavie"],
    [6, "États-Unis d'Amérique"],
    [7, "Royaume-Uni"],
    [8, "Australie"],
    [9, "Nouvelle-Zélande"],
    [10, "Fidji"],
    [11, "Îles Cook"],
    [12, "Tuvalu"],
    [13, "Niue"],
    [14, "Canada"],
    [15, "Russie"],
    [16, "Serbie"],
    [17, "Slovaquie"],
    [18, "Slovénie"],
    [19, "Pays-Bas"],
    [20, "Luxembourg"],
    [21, "République Tchèque"],
    [22, "Vanuatu"],
    [23, "Afrique du Sud"],
    [24, "Jamaïque"],
    [25, "Zimbabwe"],
    [26, "Burundi"],
    [27, "Guinée équatoriale"],
    [28, "Djibouti"],
    [29, "Timor oriental"],
    [30, "Bahamas"],
    [31, "Philippines"],
    [32, "Palestine"],
    [33, "Soudan"],
    [34, "Soudan du Sud"],
    [35, "Jordanie"],
    [36, "Koweït"],
    [37, "Égypte"],
    [38, "Syrie"],
    [39, "Irak"],
    [40, "Yémen"],
    [41, "Oman"],
    [42, "Iran"],
    [43, "Arabie saoudite"],
    [44, "Émirats Arabes Unis"],
    [45, "Brésil"],
    [46, "Tonga"],
    [47, "Samoa"],
    [48, "Argentine"],
    [49, "Uruguay"],
    [50, "Guatemala"],
    [51, "Honduras"],
    [52, "Costa Rica"],
    [53, "Thaïlande"],
    [54, "Malaisie"],
    [55, "Singapour"],
    [56, "Maldives"],
    [57, "Mauritanie"],
    [58, "Libye"],
    [59, "Algérie"],
    [60, "Pakistan"],
    [61, "Comores"],
    [62, "Turkménistan"],
    [63, "Ouzbékistan"],
    [64, "Azerbaïdjan"],
    [65, "Turquie"],
    [66, "Tunisie"],
    [67, "Israël"],
    [68, "Japon"],
    [69, "Palaos"],
    [70, "Bangladesh"],
    [71, "Vietnam"],
    [72, "République populaire de Chine"],
    [73, "Suriname"],
    [74, "Somalie"],
    [75, "Macédoine du Nord"],
    [76, "Malawi"],
    [77, "Kirghizistan"],
    [78, "Myanmar (Birmanie)"],
    [79, "Burkina Faso"],
    [80, "Sénégal"],
    [81, "Cameroun"],
    [82, "Mali"],
    [83, "Guinée"],
    [84, "Guinée-Bissau"],
    [85, "Bénin"],
    [86, "Guyana"],
    [87, "Éthiopie"],
    [88, "Érythrée"],
    [89, "Ghana"],
    [90, "Bolivie"],
    [91, "République du Congo"],
    [92, "République démocratique du Congo"],
    [93, "Saint-Christophe-et-Niévès"],
    [94, "République centrafricaine"],
    [95, "Tanzanie"],
    [96, "Grenade"],
    [97, "Niger"],
    [98, "Papouasie-Nouvelle-Guinée"],
    [99, "Bhoutan"],
    [100, "Cuba"],
    [101, "Sao Tomé-et-Principe"],
    [102, "Liberia"],
    [103, "Togo"],
    [104, "Népal"],
    [105, "Bélize"],
    [106, "Bosnie-Herzégovine"],
    [107, "Chili"],
    [108, "Cambodge"],
    [109, "Cap-Vert"],
    [110, "Haïti"],
    [111, "Îles Marshall"],
    [112, "Nauru"],
    [113, "Maurice"],
    [114, "Seychelles"],
    [115, "République dominicaine"],
    [116, "Panama"],
    [117, "Paraguay"],
    [118, "Sierra Leone"],
    [119, "Gabon"],
    [120, "Bahreïn"],
    [121, "Qatar"],
    [122, "Sri Lanka"],
    [123, "Vatican"],
    [124, "Saint-Marin"],
    [125, "Liechtenstein"],
    [126, "Malte"],
    [127, "Suède"],
    [128, "Finlande"],
    [129, "Islande"],
    [130, "Norvège"],
    [131, "Danemark"],
    [132, "Géorgie"],
    [133, "Suisse"],
    [134, "Mozambique"],
    [135, "Ouganda"],
    [136, "Chypre"],
    [137, "Tadjikistan"],
    [138, "Corée du Nord"],
    [139, "Corée du Sud"],
    [140, "Biélorussie"],
    [141, "Ukraine"],
    [142, "Micronésie"],
    [143, "Monténégro"],
    [144, "Maroc"],
    [145, "Brunei"],
    [146, "Barbade"],
    [147, "Angola"],
    [148, "Albanie"],
    [149, "Allemagne"],
    [150, "Belgique"],
    [151, "Estonie"],
    [152, "Lettonie"],
    [153, "Lituanie"],
    [154, "Eswatini"],
    [155, "Lesotho"],
    [156, "Arménie"],
    [157, "Trinité-et-Tobago"],
    [158, "Kenya"],
    [159, "Dominique"],
    [160, "Côte d'Ivoire"],
    [161, "Irlande"],
    [162, "Nigeria"],
    [163, "Madagascar"],
    [164, "Rwanda"],
    [165, "Laos"],
    [166, "Inde"],
    [167, "Croatie"],
    [168, "Colombie"],
    [169, "Équateur"],
    [170, "Vénézuéla"],
    [171, "Antigua-et-Barbuda"],
    [172, "Pérou"],
    [173, "Monaco"],
    [174, "Pologne"],
    [175, "Indonésie"],
    [176, "Autriche"],
    [177, "Liban"],
    [178, "Portugal"],
    [179, "Espagne"],
    [180, "Bulgarie"],
    [181, "Hongrie"],
    [182, "Salvador"],
    [183, "Nicaragua"],
    [184, "Botswana"],
    [185, "Sainte-Lucie"],
    [186, "Kazakhstan"],
    [187, "Grèce"],
    [188, "Mongolie"],
    [189, "Kiribati"],
    [190, "Namibie"],
    [191, "Saint-Vincent-et-les-Grenadines"],
    [192, "Gambie"],
    [193, "Îles Salomon"],
    [194, "Zambie"],
    [195, "Mexique"],
    [196, "Afghanistan"],
    [197, "Ossétie du Sud-Alanie"],
    [198, "Kosovo"],
    [199, "Chypre du Nord"],
    [200, "République de Chine (Taïwan)"],
    [201, "République arabe sahraouie démocratique"],
    [202, "Abkhazie"],
  ]);
  regexMap: Map<number, string[]> = new Map([
    [0, ["^(LA )?FRANCE"]],
    [1, ["^(L['| ])?ITALIE"]],
    [2, ["^(LA )?ROUMANIE"]],
    [3, ["^(LE )?TCHAD"]],
    [4, ["^(L['| ])?ANDOR+[AE]"]],
    [5, ["^(LA )?MOLD[AO]V(A|IE)"]],
    [6, ["^(LES )?[EÉ]TATS[-| ]UNIS", "^(LES )?USA", "^(L'|L )?AM[EÉ]RIQUE"]],
    [
      7,
      [
        "^(LE )?ROY[AU]+ME[-| ]UNI",
        "^(LA )?GRANDE[-| ]BR[AEI]TAGNE",
        "^^(L['| ])?ANGL[AEI]TER+E",
        "^UK$",
      ],
    ],
    [8, ["^(L['| ])?AUSTRALIE"]],
    [9, ["^(LA )?N[OU]+VEL+E[-| ]Z[EÉ]+LANDE"]],
    [10, ["^(LES )?FIDJI"]],
    [11, ["CO+K$"]],
    [12, ["^(LES )?TUV[AU]LU"]],
    [13, ["^NI[UE|EU]"]],
    [14, ["^(LE )?CANADA"]],
    [15, ["^(LA )?(F[EÉ]D[EÉ]RATION DE )?RUSSIE"]],
    [16, ["^(LA )?SERBIE"]],
    [17, ["^(LA )?SLOVAQUI?E"]],
    [18, ["^(LA )?SLOV[EÉ]NIE"]],
    [19, ["^(LES )?PAYS[-| ]BAS", "^(LA )?HOL+ANDE"]],
    [20, ["^(LE )?LUXEMB[OUE]+RG"]],
    [21, ["TCH[EÉÈ]QUI?E$"]],
    [22, ["^(LE )?VANUATU"]],
    [23, ["^(L['| ])?AFRIQUE DU SUD"]],
    [24, ["^(LA )?JAM[AIÏ]+QUE"]],
    [25, ["^(LE )?ZI[MN]BAB(W|OU)E"]],
    [26, ["^(LE )?BURUNDI"]],
    [27, ["^(LA )?G[UI]+N[EÉ][AE] [EÉ]QU[AEIO]TORIALE"]],
    [28, ["DJIBOUTI"]],
    [29, ["^(LE )?TIMOR([-| ]LESTE| ORIENT[AE]L)"]],
    [30, ["^(LES )?BAHAMAS"]],
    [31, ["^(LES )?PHIL+[AEI]+P+INES"]],
    [32, ["^(LA )?PALESTINE"]],
    [33, ["^(LE )?SOUDAN$"]],
    [34, ["^(LE )?SOUDAN DU SUD", "^(LE)?SUD[-| ]SOUDAN"]],
    [35, ["^(LA )?JORDANIE"]],
    [36, ["^(LE )?KOWE[IÏ]T"]],
    [37, ["^(L['| ])?[EÉ]GYPTE"]],
    [38, ["^(LA )?SYRIE"]],
    [39, ["^(L['| ])?IRA[KQ]"]],
    [40, ["^(LE )?Y[EÉ]MEN"]],
    [41, ["OMAN$"]],
    [42, ["^(L['| ])?IRAN"]],
    [43, ["^(L['| ])?ARAB[EI]+ S[AUO]+DITE"]],
    [44, ["^(LES )?[EÉ]M[AEI]RATS ARABES UNIS", "^(LES)?[EÉ]AU"]],
    [45, ["^(LE )?BR[EÉ]SIL"]],
    [46, ["^(LES )?TONGA"]],
    [47, ["^(LES? )?SAMOA"]],
    [48, ["^(L['| ])?ARGENTINE"]],
    [49, ["^(L['| ])?UR[AU]G[AU]+Y"]],
    [50, ["^(LE )?G[AU]+T[AE]MALA"]],
    [51, ["^(LE )?HONDURAS"]],
    [52, ["^(LE )?COSTA RICA"]],
    [53, ["^(LA )?THA[IÏ]LANDE"]],
    [54, ["^(LA )?MALAI?SIE"]],
    [55, ["SINGAPOUR$"]],
    [56, ["^(LES )?MALDIVES"]],
    [57, ["^(LE )?M[AU]+R[AEI]TANIE"]],
    [58, ["^(LA )?LIBYE"]],
    [59, ["^(L['| ])?ALG[EÉ]RIE"]],
    [60, ["^(LE )?PAK[AEI]STAN"]],
    [61, ["^(LES )?COMORES"]],
    [62, ["^(LE )?TURKM[AEÉI]N[AEI]STAN", "^(L[AE])?TURKM[AEÉI]NIE"]],
    [63, ["^(L['| ])?OUZB[EÉ][CK]+[AEI]STAN"]],
    [64, ["^(L['| ])?AZERB[AEIÏ]+D?J[AE]N"]],
    [65, ["^(LA )?TURQUIE"]],
    [66, ["^(LA )?TUNISIE"]],
    [67, ["^ISR[AEË]+L"]],
    [68, ["^(LE )?JAPON"]],
    [69, ["^(LES )?PAL(AOS|AU)"]],
    [70, ["^(LE )?BANGL[AEI]DESH"]],
    [71, ["^(LE )?VI[EÊ]T[-| ]?NAM"]],
    [72, ["^(LA )?(R[EÉ]PUBLIQUE POPULAIRE DE )?CHINE$", "^(LA )?RPC"]],
    [73, ["^(LE )?SUR[AEI]NAME?"]],
    [74, ["^(LA )?SOMALIE"]],
    [75, ["^(LA )?MAC[AEÉI]DOINE( DU NORD)?$", "ARYM"]],
    [76, ["^(LE )?MALAWI"]],
    [77, ["^(LE )?KIRG[A-Z]+STAN", "KIRG[HU]IZIE"]],
    [78, ["^(LA )?BIRMANIE", "^(L[AE] )?MYANMAR"]],
    [79, ["^(LE )?BURKINA FASO"]],
    [80, ["^(LE )?S[EÉ]N[AEÉ]G[AE]L"]],
    [81, ["^(LE )?CAMEROUN"]],
    [82, ["^(LE )?MALI"]],
    [83, ["^(LA )?G[UI]+N[EÉ][AE]$"]],
    [84, ["^(LA )?G[UI]+N[EÉ][AE][-| ]B[AEI]S+A[OU]"]],
    [85, ["^(LE )?B[EÉ]NIN"]],
    [86, ["^(LE )?GUYANA"]],
    [87, ["^(L['| ])?[EÉ]THIOPIE"]],
    [88, ["^(L['| ])?[EÉ]RYTHR[EÉ]E"]],
    [89, ["^(LE )?GHANA"]],
    [90, ["^(LA )?BOLIVIE"]],
    [
      91,
      [
        "^(L[EA] )?(R[EÉ]PUBLIQUE DU )?CONGO$",
        "^(LE )?CONGO[-| ]BRA[Z]+AVI[L]+E$",
      ],
    ],
    [
      92,
      [
        "^(L[EA] )?(R[EÉ]PUBLIQUE D[EÉ]MOCRATIQUE DU )?CONGO$",
        "^(LA )?RDC$",
        "^(LA )?RD.? CONGO$",
        "^(LE )?CONGO[-| ]KIN[SC]HASA$",
      ],
    ],
    [
      93,
      ["^(SAINT[-| ]|ST[-| ])(KITTS|CHRISTOPHE)[-| ](ET[-| ])?NI?[ÉE]?V[IEÈ]S"],
    ],
    [94, ["CENTRAFR[AEI]CAINE$", "CENTRAFRIQUE$", "^(LA )?RCA"]],
    [95, ["^(LA )?TANZANIE"]],
    [96, ["^(LA )?GRENADE"]],
    [97, ["^(LE )?NIGER$"]],
    [98, ["N[OU]+VEL+E[-| ]G[UI]+N[ÉE]E", "^(LA )?PNG"]],
    [99, ["^(LE )?BH?OUTH?AN"]],
    [100, ["CUBA$"]],
    [
      101,
      [
        "^S[AOÕ]+[-| ]TOM[EÉ][-| ](ET |ET-)?PRINC[IÍ]PES?",
        "^(SAINT[-| ]|ST[-| ])THOMAS[-| ](ET |ET-)?L['-'| ][IÎ]LE[-| ]DU[-| ]PRINCE",
      ],
    ],
    [102, ["^(LE )?LIB[EÉ]RIA"]],
    [103, ["^(LE )?TOGO"]],
    [104, ["^(LE )?N[EÉ]PAL"]],
    [105, ["^(LE )?B[EÉ]LI[SZ]E"]],
    [106, ["^(LA )?BOSNIE[ |-]HERZ[EÉ]GOVINE"]],
    [107, ["^(LE )?CHILI"]],
    [108, ["^(LE )?CAMBODGE"]],
    [109, ["^(LE )?CAP[-| ]VERT", "^(LE )?CABO[-| ]VERDE"]],
    [110, ["HA[IÏ]TI$"]],
    [111, ["MARSHALL(S)?$"]],
    [112, ["NAURU$"]],
    [113, ["MAURICE$"]],
    [114, ["^(LES )?SEY?CHEL+ES"]],
    [115, ["DOMIN[AEI]CAINE$"]],
    [116, ["^(LE )?PANAMA"]],
    [117, ["^(LE )?PAR[AEIU]G[AU]+Y"]],
    [118, ["^(L[AE] )?SIER+A LEONE"]],
    [119, ["^(LE )?GABON"]],
    [120, ["^B(AH|HA)RE[IÏ]N"]],
    [121, ["^(LE )?QATAR"]],
    [122, ["^(LE )?SRI LANKA"]],
    [123, ["^(LE )?VATICAN"]],
    [124, ["^(ST[-| ]|SAINT[-| ])MARIN"]],
    [125, ["^(LE )?L[EI]+[CHT]+ENST[EI]+N"]],
    [126, ["MALTE$"]],
    [127, ["^(LA )?S([EÈ]U|U[EÈ])DE"]],
    [128, ["^(LA )?FINLANDE"]],
    [129, ["^(L['| ])?ISLANDE"]],
    [130, ["^(LA )?NORV[EÈ]GE"]],
    [131, ["^(LE )?DANEMARK"]],
    [132, ["^(LA )?G[EÉ]ORGIE"]],
    [133, ["^(LA )?SUIS+E"]],
    [134, ["^(LE )?MOZA[MN]BIQUE"]],
    [135, ["^(L['| ])?OUGANDA"]],
    [136, ["CHYPRE$"]],
    [137, ["^(LE )?TA[DJIAE]+[CK][AEI]STAN"]],
    [138, ["^(LA )?COR[EÉ]E DU NORD"]],
    [139, ["^(LA )?COR[EÉ]E DU SUD"]],
    [140, ["^(LA )?B[EÉI]+LORUSSIE", "^(LE )?B[EÉ]LARUS"]],
    [141, ["^(L['| ])?UKRAINE"]],
    [142, ["^(LA )?MICRON[EÉ]SIE"]],
    [143, ["^(LE )?MONT[EÉ]N[EÉ]GRO"]],
    [144, ["^(LE )?MAROC"]],
    [145, ["BRUN[EÉ]I$"]],
    [146, ["^(LA )?BARBADE"]],
    [147, ["^(L['| ])?ANGOLA"]],
    [148, ["^(L['| ])?ALBANIE"]],
    [149, ["^(L['| ])?AL+[AEI]MAGNE", "^(LA )?(RFA|BRD)"]],
    [150, ["^(LA )?BELGIQUE"]],
    [151, ["^(L['| ])?ESTONIE"]],
    [152, ["^(LA )?LET+[AEIO]NIE"]],
    [153, ["^(LA )?LITH?UANIE"]],
    [154, ["^(LE )?SWAZILAND", "^(L['| ])?ESWATINI"]],
    [155, ["^(LE )?L[AEIO]SOTHO"]],
    [156, ["^(L['| ])?ARM[EÉ]NIE"]],
    [157, ["TRIN[AEI](DAD|T[EÉ])[-| ](ET[-| ])?TOBAGO$"]],
    [158, ["^(LE )?KENYA"]],
    [159, ["^(LA )?DOM[AEI]NIQUE"]],
    [160, ["^(LA )?C[OÔ]TE D(['| ])?[AEI]V[OI]+RE"]],
    [161, ["^(L['| ])?IRLANDE"]],
    [162, ["^(LE )?NIG[EÉ]RIA"]],
    [163, ["MADAGASCAR$"]],
    [164, ["^(LE )?R(W|U|OU)ANDA"]],
    [165, ["^(LE )?LAOS"]],
    [166, ["^(L['| ])?INDE"]],
    [167, ["^(LA )?CROATIE"]],
    [168, ["^(LA )?COLO[MN]BIE"]],
    [169, ["^(L['| ])?[EÉ]QUAT(EU|UE)R"]],
    [170, ["^(LE )?V[EÉ]N[AEÉI]Z([EÉ]U|U[EÉ])LA"]],
    [171, ["ANTIGU?A[-| ](ET[-| ])?BARBUD[AE]"]],
    [172, ["^(LE )?P[EÉ]ROU"]],
    [173, ["M[AO]N[AO]CO$"]],
    [174, ["^(LA )?POLOGNE"]],
    [175, ["^(L['| ])?INDON[EÉ]SIE"]],
    [176, ["^(L['| ])?AUTRICHE"]],
    [177, ["^(LE )?LIBAN"]],
    [178, ["^(LE )?PORTUGAL"]],
    [179, ["^(L['| ])?ESPAGNE"]],
    [180, ["^(LA )?BULGARIE"]],
    [181, ["^(LA )?HONGRIE"]],
    [182, ["^(LE |EL )?SALVADOR"]],
    [183, ["^(LE )?NICARAGUA"]],
    [184, ["^(LE )?BOTSWANA"]],
    [185, ["^(SAINTE[-| ]|STE[-| ])LUCIE"]],
    [186, ["^(LE )?KAZ[A-Z]+STAN"]],
    [187, ["^(LA )?GR[EÈ]CE"]],
    [188, ["^(LA )?MONGOLIE"]],
    [189, ["^(LES )?KIR[AEI]BATI"]],
    [190, ["^(LA )?NAMIBIE"]],
    [191, ["^(SAINT[-| ]|ST[-| ])VINCENT[-| ](ET[-| ])?LES[-| ]GRENADINES"]],
    [192, ["^(LA )?GA[MN]BIE"]],
    [193, ["S[AO]L[AEIO]M[AEIO]NS?$"]],
    [194, ["^(LA )?ZA[MN]BIE"]],
    [195, ["^(LE )?M[EÉ]XIQUE"]],
    [196, ["^(L['| ])?AFGH?AN[AEI]STAN"]],
    [197, ["^(L['| ])?OSS[EÉ]TIE DU SUD([-| ]ALANIE)?$"]],
    [198, ["^(LE )?KOSOVO"]],
    [
      199,
      [
        "CHYPRE DU NORD$",
        "^CHYPRE TUR(QUE|C)$",
        "^(LA )?R[EÉ]PUBLIQUE TUR(QUE|C) DE CHYPRE$",
      ],
    ],
    [
      200,
      [
        "^TA[IÏ]WAN$",
        "^(LA )?(R[EÉ]PUBLIQUE DE )?CHINE$",
        "^(LE )?TA[IÏ]PEI CHINOIS$",
      ],
    ],
    [
      201,
      [
        "^(LA )?R[EÉ]PUBLIQUE (ARABE )?SA[AHR]+?OUIE? D[EÉ]MOCRATIQUE",
        "^(LE )?SA[HA]+RA OCCIDENTAL$",
        "^(LA )?RASD$",
      ],
    ],
    [202, ["^(L['| ])?ABKH?A[ZS]IE"]],
  ]);
  scrolledPercentage = 0;
  answered = 0;
  chrono: string;
  timer = this.TOTAL_TIME;
  timerObservable: Observable<number>;
  isTheGameStarted = false;
  cancelledTimer = false;

  constructor(
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    for (let i = 0; i < this.correspondanceMap.size; i++) {
      this.srcFlagList.push(i.toString());
    }
    this.shuffle(this.srcFlagList);
  }

  async startGame() {
    this.isTheGameStarted = true;
    await this.doTimer();
    this.timerObservable.subscribe((time) => {
      if (time < 1) {
        console.log("Fin du temps !");
        this.presentAlertDefeat();
      }
    });
  }

  shuffle(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async updateScrollPercentage(event) {
    const elem = document.getElementById("ion-content-id");
    const scrollElement = await (elem as any).getScrollElement();

    const scrollPosition = event.detail.scrollTop;
    const totalContentHeight = scrollElement.scrollHeight;
    const viewportHeight = elem.offsetHeight;

    this.scrolledPercentage =
      scrollPosition / (totalContentHeight - viewportHeight);
  }

  async presentAlertVictory(time: number) {
    const alert = await this.alertController.create({
      cssClass: "my-victory-alert",
      header: "Félicitation !",
      subHeader: " Temps : " + time.toMMSS(),
      message:
        "Vous avez réussi à trouver tous les drapeaux de tous les pays, vous êtes super balèze. <br><br> Bon assez joué, je vous redirige vers l'accueil",
      buttons: [
        {
          text: "Merci",
          cssClass: "victory-button",
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss();
    await this.router.navigate(["/", "home"]);
  }

  async presentAlertDefeat() {
    const alert = await this.alertController.create({
      cssClass: "my-defeat-alert",
      header: "Perdu !",
      subHeader: "Quel dommage",
      message:
        "Malheureusement le temps est écoulé et vous n'avez pas réussi à trouver tous les drapeaux. Vous ferez certainement mieux la prochaine fois. <br><br> Bon assez joué, je vous redirige vers l'accueil",
      buttons: [
        {
          text: "Trop triste :'(",
          cssClass: "defeat-button",
        },
      ],
    });

    await alert.present();
    await alert.onDidDismiss();
    await this.router.navigate(["/", "home"]);
  }

  async doTimer() {
    this.timerObservable = new Observable((observer) => {
      observer.next(this.timer);
      if (this.timer === 0) {
        observer.complete();
      }
    });
    try {
      for (let i = this.timer; i > 0; i--) {
        if (this.cancelledTimer) {
          throw new Error("Timer stopped");
        }
        await this.delay(1000);
        this.timer = this.timer - 1;
        this.chrono = this.timer.toMMSS();
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  delay(delay: number) {
    return new Promise((r) => {
      setTimeout(r, delay);
    });
  }

  checkResponse(flag: string, response: string) {
    const correspondance = this.correspondanceMap.get(+flag);
    const regex = this.regexMap.get(+flag);
    regex.forEach((element) => {
      const reg = new RegExp(element, "i");
      if (reg.test(response)) {
        console.log("Bonne réponse !");
        this.answered++;
        document
          .getElementById("my-ion-input-" + flag)
          .setAttribute("value", correspondance);
        document
          .getElementById("my-ion-input-" + flag)
          .setAttribute("disabled", "true");
        document
          .getElementById("my-ion-input-" + flag)
          .setAttribute("color", "success");
        const sibling = document.getElementById("my-ion-input-" + flag)
          .parentElement.parentElement.nextElementSibling;
        if (sibling) {
          const siblingInput = sibling.children[1].children[0].children[0];
          (siblingInput as HTMLElement).focus();
        }
        if (this.answered >= this.correspondanceMap.size) {
          this.cancelledTimer = true;
          const currentTime = this.timer;
          const spentTime = this.TOTAL_TIME - currentTime;
          this.presentAlertVictory(spentTime);
        }
      }
    });
  }
}
