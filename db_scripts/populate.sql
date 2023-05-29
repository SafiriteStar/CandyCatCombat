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
    "<p>Your most basic and versatile candy cat.</p>
    <p><b>The shield they carry makes them effective against Candy Corn Cats.</b></p>
    <p>Their average stats lets them fill many different roles in the team.</p>"
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
    "<p>Your super ranged candy cat.</p>
    <p><b>If they don't move they strike twice.</b></p>
    <p>Their poor defensive stats means they require good protection.</p>"
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
    "<p>Your powerhouse candy cat.</p>
    <p><b>Costs 2 slots. Has twice as high stats on average.</b></p>
    <p>They are rather slow but are bulky enough to get where they need.</p>"
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
    "<p>Your stealthy candy cat.</p>
    <p><b>Can't be attacked while in stealth. !OPPONENT CAN STILL SEE THE CANDY CAT!</b></p>
    <p>They can gain stealth again after not attacking for a while. Useful for hit and runs.</p>"
),
(
    'Pop Cat',
    900,
    400,
    150,
    3,
    2,
    3,
    1,
    "<p>Your explosive candy cat.</p>
    <p><b>Hits in a 1 hex AOE around the main target. !BEWARE FRIENDLY FIRE!</b></p>
    <p>Herd your enemies together for maximum effectiveness.</p>"
),
(
    'Caramel Cat',
    1000,
    300,
    200,
    4,
    1,
    2,
    1,
    "<p>Your utility candy cat.</p>
    <p><b>Roots targets with attacks. Rooted targets cannot move. Attacks at 2 range deal no damage.</b></p>
    <p>Root lasts for 1 turn but can be chained with consecutive attacks.</p>"
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
    "<p>Your lovable healer candy cat.</p>
    <p><b>Heals everyone, including opponents. Everyone is a friend!</b></p>
    <p>Self heals when below 50% health. Takes a small amount of damage each time they heal a friend.</p>"
);

# States
insert into game_cat_state (gcs_state) values ('Standby'), ('Acted'), ('Dead');

# Conditions
insert into cat_condition (ccn_name) values ('Stealth'), ('Rooted'), ('ReStealth'), ('HealingFervor');

# Map Related Stuff
insert into board (brd_name) values ("Placement Map");
insert into board (brd_name) values ("The Arena");
insert into tile_type (tty_type) values ('Normal'), ('Wall'), ('Placement');

# Fill the board with normal tiles