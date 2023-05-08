# Do not change the order or names of states 
#(the code is assuming specific IDs and names)
# You can add more in the end
insert into game_state (gst_state) values ('Waiting'), ('Started'), ('Finished'), ('Canceled');

# Do not change the order, but you can add more in the end
# Putting cats at placement tiles at the start of the game
insert into user_game_state (ugst_state) values ('Placement');
# Ready to start the game
insert into user_game_state (ugst_state) values ('PlacementReady');
# Waiting for your turn
insert into user_game_state (ugst_state) values ('Waiting');
# Playing during your turn
insert into user_game_state (ugst_state) values ('Playing');
# Looking at the score after the game
insert into user_game_state (ugst_state) values ('Score');
# The game has ended, the user has left
insert into user_game_state (ugst_state) values ('End');

# Possible end game states
insert into scoreboard_state (sbs_state) values ('Tied'), ('Lost'), ('Won');

# Cats
insert into cat (
    cat_name,
    cat_max_health,
    cat_damage, 
    cat_defense,
    cat_speed,
    cat_min_range,
    cat_max_range,
    cat_cost,
    cat_description
)
values (
    'Vanilla Cat',
    1200,
    400,
    200,
    5,
    1,
    1,
    1,
    "A versatile candy cat with average stats across the board. Fights in close melee range but can fill many different roles."
),
(
    'Candy Corn Cat',
    1200,
    350,
    100,
    3,
    3,
    6,
    1,
    "A bow and arrow wielding candy cat with the longest strike range of all other cats. Not suitable for melee. Can attack twice if they haven't moved."
),
(
    'Mawbreaker Cat',
    2200,
    500,
    200,
    3,
    1,
    2,
    2,
    "The hardest hitting, toughest candy cat around. Cost twice as much to have in your team but has twice the impact of your average candy cat."
),
(
    'Gum Cat',
    900,
    450,
    100,
    6,
    1,
    1,
    1,
    "With cloak and dagger this candy cat is difficult to catch and loves catching opponents from a flank. Unable to be hit while in stealth mode, which is lost when attacking. Starts the game in stealth and can regain it after not attacking or being attacked for 3 turns. An attack while in stealth deals triple the damage!"
),
(
    'Pop Cat',
    900,
    400,
    100,
    3,
    2,
    3,
    1,
    "Fizzling with excitement at the opportunity of causing more explosions, this candy cat lobes sizzling explosives at enemies causing damage across an area. Be careful where you position this candy cat however, as they have little regard to distinguish friend from foe."
),
(
    'Caramel Cat',
    1200,
    350,
    200,
    5,
    1,
    2,
    1,
    "Bulky and cheerful, this candy cat loves to protect their allies by keeping opponents in place. Attacks at melee range deal damage and stick enemies in place. This candy cat can also throw some caramel a short distance away at opponents to keep them in place, even if they don't deal any damage doing so. Despite their vigilant attitude this candy cat cannot hold out for long while out numbered so keep them with a partner!"
),
(
    'Choco Dairy Milk Cat',
    900,
    150,
    100,
    3,
    1,
    2,
    1,
    "Always ready to help, this ever affable candy cat can heal their allies at the cost of hurting themselves. While at have health their fervor drives them to keep going, healing them a small amount at the start of each turn. This candy cat otherwise cannot heal and is rather fragile, keep them safe."
);

# States
insert into game_cat_state (gcs_state) values ('Standby'), ('Acted'), ('Dead');

# Conditions
insert into cat_condition (ccn_name) values ('Stealth'), ('Rooted'), ('ReStealth');

# Map Related Stuff
insert into board (brd_name) values ("Placement Map");
insert into board (brd_name) values ("The Arena");
insert into tile_type (tty_type) values ('Normal'), ('Wall'), ('Placement');

# Fill the board with normal tiles