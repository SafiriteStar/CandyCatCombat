# Do not change the order or names of states 
#(the code is assuming specific IDs and names)
# You can add more in the end
insert into game_state (gst_state) values ('Waiting'), ('Started'), ('Finished'), ('Canceled');

# Do not change the order, but you can add more in the end
-- Waiting for your turn
insert into user_game_state (ugst_state) values ('Waiting');
-- Playing during your turn
insert into user_game_state (ugst_state) values ('Playing');
-- Looking at the score after the game
insert into user_game_state (ugst_state) values ('Score');
-- The game has ended, the user has left
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
    cat_cost
)
values (
    'Vanilla Cat',
    1200,
    400,
    200,
    5,
    1,
    1,
    1
),
(
    'Candy Corn Cat',
    1200,
    350,
    100,
    3,
    2,
    6,
    1
),
(
    'Mawbreaker Cat',
    2200,
    500,
    200,
    3,
    1,
    2,
    2
),
(
    'Gum Cat',
    900,
    450,
    100,
    6,
    1,
    1,
    1
),
(
    'Pop Cat',
    900,
    400,
    100,
    3,
    1,
    3,
    1
),
(
    'Caramel Cat',
    1200,
    350,
    200,
    5,
    1,
    2,
    1
),
(
    'Choco Dairy Milk Cat',
    900,
    150,
    100,
    3,
    1,
    2,
    1
);

insert into game_cat_state (gcs_state) values ('Visible'), ('Stealth');

# Map Related Stuff
insert into board () values ();
insert into tile_type (tty_type) values ('Normal'), ('Wall'), ('Placement');