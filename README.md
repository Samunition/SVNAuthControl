# SVNAuthControl
Single page app to control a SVN access control list

SVN Permissions Manager
~~~~~~~~~~~~~~~~~~~~~~~~

Group Members
~~~~~~~~~~~~~~
Adam Tattersall
Sam Lee
Robert Sadler
Jamie Dayan
John Ademola


Organisation of file
~~~~~~~~~~~~~~~~~~~~~
4 files : css, files, img, scripts
index.html

css
~~~
spm_css.css

files
~~~~~~
auth.txt

img
~~~~
read.bmp
search.bmp
write.bmp

scripts
~~~~~~~~
load-file.php
load-group.php
load-users.php
save-file.php
spmFunc.js



How to install
~~~~~~~~~~~~~~~
See installation guide








                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                  
                                                     

































													  
                                                                  ````..--.-----:--:--:::/+osoossssyyyyssssyysoooooo/::..-........`````.```````````                                                      
                                                              ``..---------------:/+++++++ossosysssyhhyyhyyyyyyyyssoo:.-:.--:--:-.`..`..-...````````                                                    
                                                              ``.--:///://:::::-/++++//+o+++//+++oo+o+ooosssyyhyyysss+/+/:/::::::-------:-...```.`                                                      
                                                             ````.-:///////////++++/////::::::://////:::::/+++oosooooo+oo///://://:::::::---..`..````                                                   
                                                            ````..-://+++ooo++//::::::::-::::::::::://:/::::::::/+++++o+++/:+++//////:://:-.....```                                                     
                                            `              ``````.-:/+syyyo+/::---::::-------------:::/:::::/::::://:::///://////////:/::--...```                                                       
                                            `            ````..---/+osys+/::--....--...............-----:::://::::::/:--:::::-:-///////:-...``````                                                      
                                          ` ```        ````..--://+oso+/:---........```````````..---------:::::::::::/:..---.-::://:/:::-..```````                                                      
                                          `   ````` ````...--:---:+o+//:---...```````````````....---------://////::::::-..-..---::::::---..``````                                                       
                                           ```````````.....------/+////:::--..````````````````...-------::::////////::::-..-.....-:::::---..``````                                                      
                                             ``````````..-----..:/:::///:::-......``````````........-----:://://////////:-..------:-:::::---.....``                                                     
                                               ````.....--.....-::::////::--...---.........----..--------:::////+/+++///::--.--:::::::-----..``...`                                                     
                                          ``    `````......--..--://///:::--....-----------::::------::::::://++++++++++//-:--.--::::::::--......````                                                   
                                          ``    ``..............://////::::-----------:::::::::-----::::::////+++ooooo++//-::::-----:::::-----...```                                                    
                                          ````  ````.....--....-/+/////////:--:::-------:-:::-:---------:/++++++oosoooo+/::://:///:--:::-----.......`                                                   
                                          ``````````....--.`..-:/++++++++//////://:-------:::--::::----::/++++++osssooo++/////+/+oo+:---------.....```                                                  
                                           `````````..---.....-:++++++++////////++::---:-:::://///:-:::://++++++oooooooo+++/+++///+++/::-----:--.``   `                                                 
                                            ``````....--.....--:++++++//:://///+//:::-----::::::::::::::/+++++++++ooooooo++++o++/////:::://///++/:`   `                                                 
                                              ``....------..--:/++++/////::::::/:::------:::::::------::///++++ooooooosooooo+++++/:/:////////////+:`                                                    
                                              ````..--::--.-::/++++::/:::---:::::::------:::::::-----::::////++oooooosoooooooooooo+/////////////::+-`                                                   
                                              `````...-----:/:/+++///:::-----:::::--------::::::--:::-:-::///++++++oooooossoooosyyyyo++++++////+/:/-`                                                   
                                                .....-----///:/++++/osoo++/::--:::::::::-:::::::::--:////+o++ssso++ooossssssssosssyyysoso+//:--:++-..                                                   
                                                `..-----::+o/:/+++++syyyysssssoo++//://::://::::::/++oossssssssyysooossosssssoossosyysssyo:.-..--/-..                                                   
                                                 `.------/os+//+++++ossssssyyyyyyssoo+o+///oo+++osyyyyyysoo++oossssssoooooooooooosossssos:-......:.`                                                    
                                                  .-....-:/oo/:+++++ooooooooooosossyyysoo+//+syyyyyssysooo+oosysssooooooooossoosssssssoso..```   --                                                     
                                                  `..``.-:///--/+++ooosssssoshhhhosssyhhs++/+syyyysyhhs++o++++yysso+++oooosssssssyyyysso:.````   .`                                                     
                                                    ``.-::::-.-/+oooooosys+:shhsh/+ssoyhs/:-/+sysyyyyyysso+ooooooooo+oooooossssyssyssys+-..```                                                          
                                                     `.-----.--:+ooooooos++/+ossooo++sys+:-:/+osssssyyssoo++osssso++ooossssyyyyyoosssyo//:--.``                                                         
                                                     ````./+/:-:+oooooooo++o++o++++ooooo/-::/+ossoooossso++osssoooosssssssysyysyosyyyso-...``...``                                                      
                                                       ``.-:::/+so+ooo+/+o+//+////+++++o+::/+ooooooo+++++ooosssoosooosssssssssyhhyyyysoo/-.--..``                                                       
                                                          `-..-:+o++o+++/:+o++++++++++++/::/oooo+++++oo+/+osossssss++syssssssssyyhyssso+/:-..`                                                          
                                                           ``..:/o//oooo++//++/////++++++/:/+ooso++oosysoo+osssssso+/osssssoossyyys+://-...``                                                           
                                                             ``.-:-/+ooooo++oo+++++o++so++::/+ossosyyoosyyooossssso+/osossooossyyy+-----.``                                                             
                                                                 `./++oo+oosossoooosssssoo/::+ssssyyyo++oyysoosso+o++o+osoooossyyo/-.``                                                                 
                                                                  `://++++osssssooosssyyssso+syyyhyysoo++osssooo+/+o+o++ooooosyhy+-`                                                                    
                                                                  `::////+ooooooooo++shhhyyyyhyysssso+oo+++oso+oo+o+++++++o+oshdddh/`                                                                   
                                                                   --:::/++ooooo+:--/+syhhhhyyyssoooo+oooo//+++o+/++++++++++oshhmmmdy:                                                                  
                                                                   .:::///+ooo+/:-:/++ooossosoosssyyyyys++/:-/++///++++++++osyhdymmmddo.                                                                
                                                                   `:-:/+++oo//:::+++oooosssssyyhyhdohdhso+//:/:://+++++++osshddodmmmmdh/.                                                              
                                                                    -:://+++/:::/oossssssssyyysyhyoy+ymdyso+//::://++++++oosyhdd+ymmmmmmdho:.                                                           
                                                                    `::///++/::/ooo+++/////+++ooooossyhhhsso//:::://+++ooooyhdhm/smmmmmmmmmdhso+/::-..``                                                
                                                                     `::////:-:/+////+++++++++++++ooooosssso+//::///+oooosyhdhhd-hmNNNNNmmmmmmmmddddhhyyso+:--..``                                      
                                                                    `-o/////:::-:-::++oosssoooooooooooooooo+//////+++oosyyhddhh+:mNNNNNNNNNNNmmmmmmmmmmmmdddddhhyys+/:--..``                            
                                                               ``.:+yddho+++//::--:/osssoooooooossssoooo+//+::////++oosyydddhhs.yNNNNNNNNNNNNNNNNNNNNmmmmmmmmmmmmmmmdddddhysso+/-.`                     
                                                           `.:+shddmmmmmdso++///:/++osooooooooosssysso+/+o+++++++++oosyhdddhys-omNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNmmmmmmmmmmmmmddddhyo/:..``              
                                                       `.-/shdmmmmmmmmmmmmyoo+////o++ooooooo++osssysoo//+oo+++++++osyhhdddhy+.omNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNmmmmmmmmmmmddhyyso+:-..``     
                                                  `.-/oshdmmmmmmmmNNNNNNNNmdso+///+o+++oooo++ooossssoo+++ooooo+oooyyhddddhy:-yNNNNNNNNNNMMMMMMMMNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNmmmmmmmmmmmddhhyso+/-
                                             ``.:+yhddmmmmmmmNNNNNNNNNNNNNNNmhso+///++++oooosssoooooo+++++ooooossyhhddddy+-/dNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNmmmmmmmmmmmd
                                        ``-/oyhddmmmmmmmmNNNNNNNNNNNNNNNNNNNNNmys+/++++++oooosooooooo++ooooossyyhhdmmdy/-/hNNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNNNNNNNNNNNNNNNNNNNNNNNNNNNN
                                   ``-/oyhdmmmmmmmmNNNNNNNNNNNNNNNNNNNNNNNNNNNNNdyoo++oo+oooooooooooosossosyhhhdmmdy+-.+hNNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNMMNNMNNNNNNNNNNNNNNNNN
                               ``-+shddmmmmmmmmNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNdhsoooossssssossoosssyyhhddmmdh+-.:smNNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNNNNNN
                           `.-+shdmmmmmmmNNNNNNNNNNNNNNNNNNNNNNMMMMMMMMMMMMMMMMNNNNNmdhyyyyhyyyyyyyyyhhhdddddy+-.:sdNNNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
                      `.:+shddmmmmmmNNNNNNNNNNNNNNNNNNNNNNMMMNMMMMMMMMMMMMMMMMMMMMMNNNNNNmmmmdddddhhyysso+/:.``+dNNNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
                 `-/oshddmmmmmmmNNNNNNNNNNNNNNNNNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNNNNNNh+:---..```  `smNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
              -oyhddmmmmmmmmNNNNNNNNNNNNNNNNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNNNNNo:-..````    /mNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
            `+ddmmmmmmmNNNNNNNNNNNNNNNNNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNNh:..`````    .dNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
            odmmmmmNNNNNNNNNNNNNNNNNNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNNhoo++/++ooyhmNNNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM

                                                                                                                                                                             
                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                  
                                                            DDDDDDDDDDDDD      RRRRRRRRRRRRRRRRR   IIIIIIIIIINNNNNNNN        NNNNNNNNKKKKKKKKK    KKKKKKK !!! 
                                                            D::::::::::::DDD   R::::::::::::::::R  I::::::::IN:::::::N       N::::::NK:::::::K    K:::::K!!:!!
                                                            D:::::::::::::::DD R::::::RRRRRR:::::R I::::::::IN::::::::N      N::::::NK:::::::K    K:::::K!:::!
                                                            DDD:::::DDDDD:::::DRR:::::R     R:::::RII::::::IIN:::::::::N     N::::::NK:::::::K   K::::::K!:::!
                                                            D:::::D    D:::::D R::::R     R:::::R  I::::I  N::::::::::N    N::::::NKK::::::K  K:::::KKK!:::!
                                                            D:::::D     D:::::DR::::R     R:::::R  I::::I  N:::::::::::N   N::::::N  K:::::K K:::::K   !:::!
                                                            D:::::D     D:::::DR::::RRRRRR:::::R   I::::I  N:::::::N::::N  N::::::N  K::::::K:::::K    !:::!
                                                            D:::::D     D:::::DR:::::::::::::RR    I::::I  N::::::N N::::N N::::::N  K:::::::::::K     !:::!
                                                            D:::::D     D:::::DR::::RRRRRR:::::R   I::::I  N::::::N  N::::N:::::::N  K:::::::::::K     !:::!
                                                            D:::::D     D:::::DR::::R     R:::::R  I::::I  N::::::N   N:::::::::::N  K::::::K:::::K    !:::!
                                                            D:::::D     D:::::DR::::R     R:::::R  I::::I  N::::::N    N::::::::::N  K:::::K K:::::K   !!:!!
                                                            D:::::D    D:::::D R::::R     R:::::R  I::::I  N::::::N     N:::::::::NKK::::::K  K:::::KKK !!! 
                                                            DD:::::DDDDD:::::DRR:::::R     R:::::RII::::::IIN::::::N      N::::::::NK:::::::K   K::::::K     
                                                            D:::::::::::::::DD R::::::R     R:::::RI::::::::IN::::::N       N:::::::NK:::::::K    K:::::K !!! 
                                                            D::::::::::::DDD   R::::::R     R:::::RI::::::::IN::::::N        N::::::NK:::::::K    K:::::K!!:!!
                                                            DDDDDDDDDDDDD      RRRRRRRR     RRRRRRRIIIIIIIIIINNNNNNNN         NNNNNNNKKKKKKKKK    KKKKKKK !!! 
                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                  
