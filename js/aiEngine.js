// FitAI Smart Intelligent AI Recommendation Engine
// Provides dynamic workouts, conversational coach responses, timed meal plans, and pantry food swaps

export const AI_ENGINE = {
  /**
   * Generates dynamic workout routines tailored to equipment, duration, fatigue, and focus
   */
  generateWorkout(options = {}, userProfile = {}) {
    const focus = options.focus || 'full_body'; // 'full_body' | 'upper' | 'lower' | 'core_hiit' | 'mobility'
    const duration = Number(options.duration) || 30; // minutes
    const equipment = options.equipment || userProfile.equipmentAvailable || 'dumbbells';
    const fatigue = options.fatigue || userProfile.fatigueLevel || 'low';
    const goal = userProfile.primaryGoal || 'muscle';

    // Base exercise repository mapped by equipment and focus
    const EXERCISE_DB = {
      full_body: {
        gym: [
          { name: 'Barbell Back Squat', target: 'Quads & Glutes', sets: 4, reps: '8-10', rest: 90, cue: 'Keep chest proud, drive knees out over pinky toes, hit parallel.' },
          { name: 'Incline Dumbbell Bench Press', target: 'Upper Chest & Triceps', sets: 3, reps: '10-12', rest: 75, cue: '30-degree bench angle, tuck elbows at 45 degrees.' },
          { name: 'Seated Cable Row', target: 'Lats & Rhomboids', sets: 3, reps: '10-12', rest: 60, cue: 'Retract shoulder blades before pulling to your naval.' },
          { name: 'Romanian Deadlift (Dumbbell or Barbell)', target: 'Hamstrings & Glutes', sets: 3, reps: '10-12', rest: 75, cue: 'Hinge hips back with a flat spine until hamstring stretch.' },
          { name: 'Cable Woodchoppers', target: 'Obliques & Core', sets: 3, reps: '12 per side', rest: 45, cue: 'Pivot back foot and engage core through rotation.' }
        ],
        dumbbells: [
          { name: 'Dumbbell Goblet Squat', target: 'Quads & Core', sets: 4, reps: '10-12', rest: 60, cue: 'Hold dumbbell vertically close to sternum, deep hip sink.' },
          { name: 'Dumbbell Neutral-Grip Floor Press', target: 'Chest & Triceps', sets: 3, reps: '10-12', rest: 60, cue: 'Drive upper arms down gently until elbows tap floor, then press.' },
          { name: 'Dumbbell Bent-Over Row', target: 'Upper Back & Lats', sets: 3, reps: '12', rest: 60, cue: 'Hinge at 45 degrees, pull dumbbells towards hips.' },
          { name: 'Dumbbell Romanian Deadlift', target: 'Hamstrings & Glutes', sets: 3, reps: '10-12', rest: 60, cue: 'Soft knee bend, push pelvis backward like closing a car door.' },
          { name: 'Dumbbell Thruster (Squat to Overhead Press)', target: 'Full Body Power', sets: 3, reps: '10', rest: 75, cue: 'Use upward leg momentum to launch the dumbbells overhead.' }
        ],
        bands: [
          { name: 'Banded Squat with Pulse', target: 'Glutes & Quads', sets: 4, reps: '15', rest: 45, cue: 'Loop band above knees, maintain constant outward tension.' },
          { name: 'Banded Standing Chest Press', target: 'Chest & Shoulders', sets: 3, reps: '15', rest: 45, cue: 'Anchor band behind back, press forward with steady control.' },
          { name: 'Banded Bent-Over Row', target: 'Mid-Back & Lats', sets: 3, reps: '15', rest: 45, cue: 'Step on band center, pull handles towards ribcage.' },
          { name: 'Banded Good Mornings', target: 'Posterior Chain', sets: 3, reps: '15', rest: 45, cue: 'Loop band over neck and stand on base, hinge at hips.' }
        ],
        bodyweight: [
          { name: 'Tempo Air Squats (3 sec down)', target: 'Quads & Glutes', sets: 4, reps: '15-20', rest: 45, cue: 'Control descent for 3 full seconds before exploding up.' },
          { name: 'Diamond or Regular Push-Ups', target: 'Chest, Shoulders & Triceps', sets: 3, reps: '12-15', rest: 60, cue: 'Lock core in solid plank, lower until chest brushes ground.' },
          { name: 'Reverse Lunges with Knee Drive', target: 'Quads & Balance', sets: 3, reps: '12 per leg', rest: 45, cue: 'Step back into 90-degree bend, drive front heel into floor.' },
          { name: 'Prone Cobra (Scapular Retractions)', target: 'Upper Back & Posture', sets: 3, reps: '15 reps (2s hold)', rest: 45, cue: 'Lie face down, rotate thumbs to ceiling and pinch shoulder blades.' },
          { name: 'Hollow Body Hold to Bicycle Crunch', target: 'Abs & Obliques', sets: 3, reps: '20 total', rest: 45, cue: 'Press lower back into floor without arching.' }
        ]
      },
      upper: {
        gym: [
          { name: 'Barbell Bench Press', target: 'Chest & Anterior Delts', sets: 4, reps: '6-8', rest: 90, cue: 'Arch upper back slightly, grip bar firmly with wrists straight.' },
          { name: 'Overhead Barbell Military Press', target: 'Shoulders & Core', sets: 3, reps: '8-10', rest: 75, cue: 'Squeeze glutes and press in a vertical path overhead.' },
          { name: 'Lat Pulldown (Wide Grip)', target: 'Lats & Biceps', sets: 3, reps: '10-12', rest: 60, cue: 'Lead with elbows, pull bar down towards upper chest.' },
          { name: 'Incline Dumbbell Curl', target: 'Biceps Long Head', sets: 3, reps: '12', rest: 60, cue: 'Full arm extension at bottom, rotate wrists at top.' },
          { name: 'Rope Triceps Pushdown', target: 'Triceps Lateral Head', sets: 3, reps: '12-15', rest: 60, cue: 'Flare rope out at bottom, lock elbows at sides.' }
        ],
        dumbbells: [
          { name: 'Dumbbell Flat Bench / Floor Press', target: 'Chest & Triceps', sets: 4, reps: '8-10', rest: 75, cue: 'Lower dumbbells smoothly, feel chest stretch.' },
          { name: 'Single-Arm Dumbbell Row', target: 'Lats & Rhomboids', sets: 3, reps: '10-12 per arm', rest: 60, cue: 'Rest non-working arm on bench or knee, pull elbow back.' },
          { name: 'Seated Dumbbell Shoulder Press', target: 'Deltoids', sets: 3, reps: '10-12', rest: 60, cue: 'Keep core tight, press dumbbells up in slight arc.' },
          { name: 'Dumbbell Hammer Curls', target: 'Brachialis & Forearms', sets: 3, reps: '12', rest: 60, cue: 'Palms facing each other throughout the movement.' },
          { name: 'Overhead Dumbbell Triceps Extension', target: 'Triceps Long Head', sets: 3, reps: '12', rest: 60, cue: 'Keep elbows tucked near temples, full elbow bend.' }
        ],
        bodyweight: [
          { name: 'Decline / Standard Push-Ups', target: 'Chest & Triceps', sets: 4, reps: '12-15', rest: 60, cue: 'Elevate feet for upper chest emphasis.' },
          { name: 'Doorframe or Table Rows', target: 'Upper Back & Lats', sets: 3, reps: '12', rest: 60, cue: 'Keep body in rigid plank, pull chest to support.' },
          { name: 'Pike Push-Ups (Shoulder Focus)', target: 'Anterior Delts', sets: 3, reps: '10-12', rest: 60, cue: 'Elevate hips high in inverted V, head descends forward of hands.' },
          { name: 'Chair / Bench Tricep Dips', target: 'Triceps', sets: 3, reps: '12-15', rest: 60, cue: 'Lower to 90 degrees elbow bend, don’t flare shoulders forward.' }
        ]
      },
      lower: {
        gym: [
          { name: 'Barbell Back Squat', target: 'Quads & Glutes', sets: 4, reps: '6-8', rest: 90, cue: 'Brace core with 360-degree breath before descending.' },
          { name: 'Leg Press (Foot Placement Mid-High)', target: 'Quads & Glutes', sets: 3, reps: '10-12', rest: 75, cue: 'Do not let lower back round off the seat at bottom.' },
          { name: 'Lying Leg Curls', target: 'Hamstrings', sets: 3, reps: '12', rest: 60, cue: 'Keep hips pinned into the pad, squeeze at top.' },
          { name: 'Bulgarian Split Squats', target: 'Glute Medius & Quads', sets: 3, reps: '10 per leg', rest: 75, cue: 'Rear foot elevated on bench, drop back knee straight down.' },
          { name: 'Standing Calf Raises', target: 'Gastrocnemius', sets: 4, reps: '15 (2s pause at bottom)', rest: 45, cue: 'Full deep stretch at the bottom of every rep.' }
        ],
        dumbbells: [
          { name: 'Dumbbell Bulgarian Split Squat', target: 'Quads & Glutes', sets: 3, reps: '10 per leg', rest: 75, cue: 'Keep front shin relatively vertical for glute bias.' },
          { name: 'Dumbbell Romanian Deadlift', target: 'Hamstrings', sets: 4, reps: '10-12', rest: 75, cue: 'Slide dumbbells down close to your shins.' },
          { name: 'Dumbbell Goblet Squat', target: 'Quads', sets: 3, reps: '12', rest: 60, cue: 'Hold heavy dumbbell under chin, upright torso.' },
          { name: 'Dumbbell Step-Ups (Box or Bench)', target: 'Glutes & Stability', sets: 3, reps: '12 per leg', rest: 60, cue: 'Drive solely through top foot, avoid pushing off back toes.' }
        ],
        bodyweight: [
          { name: '1.5 Rep Air Squats', target: 'Quads & Glutes', sets: 4, reps: '12-15', rest: 60, cue: 'Squat down, come halfway up, go back down, then stand tall.' },
          { name: 'Walking Lunges', target: 'Quads & Hamstrings', sets: 3, reps: '20 steps total', rest: 60, cue: 'Keep torso tall, soft tap of back knee.' },
          { name: 'Single-Leg Glute Bridges', target: 'Glutes & Core', sets: 3, reps: '15 per leg', rest: 45, cue: 'Drive through heel, hold at peak contraction for 1 second.' },
          { name: 'Wall Sit with Calf Pulses', target: 'Quads & Calves', sets: 3, reps: '45 seconds', rest: 45, cue: 'Thighs strictly parallel to ground, back flat against wall.' }
        ]
      },
      core_hiit: {
        gym: [
          { name: 'Hanging Leg / Knee Raises', target: 'Lower Abs & Hip Flexors', sets: 3, reps: '12-15', rest: 45, cue: 'Avoid swinging; curl pelvis up towards sternum.' },
          { name: 'Ab Wheel Rollouts', target: 'Total Core Anti-Extension', sets: 3, reps: '10-12', rest: 60, cue: 'Tuck pelvis under, rollout only as far as back stays neutral.' },
          { name: 'Kettlebell Swings', target: 'Posterior Chain & Cardio', sets: 4, reps: '20', rest: 45, cue: 'Explosive hip snap, do not squat the kettlebell.' },
          { name: 'Battle Ropes (Alternating Waves)', target: 'Cardiovascular Power', sets: 4, reps: '30 seconds', rest: 30, cue: 'Maintain athletic quarter-squat stance, rapid arm cadence.' }
        ],
        dumbbells: [
          { name: 'Dumbbell Renegade Rows to Push-Up', target: 'Core Anti-Rotation & Chest', sets: 3, reps: '10 total', rest: 60, cue: 'Feet wide for base of support, keep hips locked level.' },
          { name: 'Dumbbell Russian Twists', target: 'Obliques', sets: 3, reps: '20 total', rest: 45, cue: 'Elevate heels slightly, rotate dumbbell side to side with control.' },
          { name: 'Dumbbell Plank Drags', target: 'Deep Transverse Abdominis', sets: 3, reps: '12 total', rest: 45, cue: 'High plank, reach opposite hand across to drag weight.' },
          { name: 'Dumbbell Burpee Deadlifts', target: 'Metabolic Conditioning', sets: 3, reps: '10', rest: 60, cue: 'Drop to chest, jump feet in, deadlift dumbbells standing tall.' }
        ],
        bodyweight: [
          { name: 'Mountain Climbers (Fast Cadence)', target: 'Core & Cardiovascular', sets: 4, reps: '35 seconds', rest: 25, cue: 'Keep hips low and drive knees aggressively to elbows.' },
          { name: 'Bicycle Crunches (Slow 2s Tempo)', target: 'Obliques & Rectus Abdominis', sets: 3, reps: '20 total', rest: 30, cue: 'Rotate from thoracic spine, touch armpit towards opposite knee.' },
          { name: 'Plank Shoulder Taps', target: 'Anti-Rotation Core', sets: 3, reps: '20 total', rest: 30, cue: 'Zero hip swaying; brace abs like taking a punch.' },
          { name: 'Burpees with Jump', target: 'Full Body Conditioning', sets: 4, reps: '12', rest: 45, cue: 'Chest touches floor, explosive jump with hands overhead.' }
        ]
      },
      mobility: {
        gym: [
          { name: 'World\'s Greatest Stretch', target: 'Thoracic, Hips, Hamstrings', sets: 3, reps: '5 per side', rest: 30, cue: 'Lunge forward, elbow to instep, open arm to ceiling.' },
          { name: '90/90 Hip Switches', target: 'Hip Internal/External Rotation', sets: 3, reps: '8 per side', rest: 30, cue: 'Tall posture, transition knees smoothly across floor.' },
          { name: 'Thoracic Foam Rolling & Cat-Cow', target: 'Spine Decompression', sets: 3, reps: '10 cycles', rest: 30, cue: 'Inhale arch, exhale round upper back with deep breath.' }
        ],
        dumbbells: [
          { name: 'Light Dumbbell Pullovers (Mobility bias)', target: 'Lats & Thoracic Extension', sets: 3, reps: '10', rest: 30, cue: 'Light weight, deep overhead stretch across bench.' },
          { name: 'Jefferson Curls (Light Weight)', target: 'Spinal Articulation & Hamstrings', sets: 3, reps: '8', rest: 45, cue: 'Roll down vertebra by vertebra, slow and controlled.' },
          { name: 'Cossack Squats', target: 'Adductors & Ankle Dorsiflexion', sets: 3, reps: '8 per leg', rest: 30, cue: 'Shift weight side to side, heel stays grounded on working leg.' }
        ],
        bodyweight: [
          { name: 'World\'s Greatest Stretch', target: 'Total Body Mobility', sets: 3, reps: '6 per side', rest: 20, cue: 'Deep lunge, rotate chest open, straighten front knee.' },
          { name: 'Pigeon Pose Active Flutters', target: 'Glutes & Piriformis', sets: 3, reps: '45 sec hold per side', rest: 20, cue: 'Square hips forward, breathe deeply into glute stretch.' },
          { name: 'Cat-Cow with Lateral Rib Reach', target: 'Spinal Mobility', sets: 3, reps: '10 reps', rest: 20, cue: 'Full inhalation on extension, complete exhalation on flexion.' },
          { name: 'Deep Squat Hold with Ankle Rocks', target: 'Hip & Ankle Mobility', sets: 3, reps: '60 seconds', rest: 30, cue: 'Sit at bottom of squat, press knees out with elbows.' }
        ]
      }
    };

    const targetCategory = EXERCISE_DB[focus] || EXERCISE_DB.full_body;
    let list = targetCategory[equipment] || targetCategory.dumbbells || targetCategory.bodyweight;

    // Adjust for time duration: ~4-5 min per exercise including rest
    const exerciseCount = Math.max(3, Math.min(list.length, Math.floor(duration / 6)));
    let selectedExercises = list.slice(0, exerciseCount);

    // Fatigue modulation
    let intensityModifier = "Optimal Load (RPE 8)";
    let restMultiplier = 1;
    if (fatigue === 'high') {
      intensityModifier = "Active Recovery Load (RPE 6, reduced volume to prevent burnout)";
      restMultiplier = 1.3;
      selectedExercises = selectedExercises.map(ex => ({
        ...ex,
        sets: Math.max(2, ex.sets - 1),
        rest: Math.round(ex.rest * restMultiplier)
      }));
    } else if (fatigue === 'fresh') {
      intensityModifier = "Peak Performance Load (RPE 8.5-9, progressive overload focus)";
    }

    const titles = {
      full_body: 'AI Dynamic Full-Body Primer',
      upper: 'AI Hypertrophic Upper Body Sculpt',
      lower: 'AI Power & Posterior Chain Builder',
      core_hiit: 'AI High-Velocity Core & Conditioning',
      mobility: 'AI Regenerative Joint Flow & Reset'
    };

    return {
      id: 'routine_' + Date.now(),
      title: titles[focus] || 'AI Custom Tailored Routine',
      focus,
      durationMinutes: duration,
      equipment,
      fatigueLevel: fatigue,
      intensity: intensityModifier,
      estimatedCaloriesBurned: Math.round((duration * 8.5) * (goal === 'weight_loss' ? 1.1 : 1.0)),
      warmup: [
        '2 mins Arm Circles & Shoulder Dislocates',
        '2 mins Hip 90/90 Rotations & Deep Squat Prys',
        '1 min Jumping Jacks or Light Shadow Boxing'
      ],
      exercises: selectedExercises,
      cooldown: [
        '1 min Deep Diaphragmatic Box Breathing (4s in, 4s hold, 4s out, 4s hold)',
        '1 min Hamstring & Quad Doorway Stretch'
      ],
      aiCoachNote: fatigue === 'high' 
        ? "⚠️ Noticed your elevated fatigue today. Volume is trimmed by 25% with extended rest to stimulate recovery without breaking down muscle tissue."
        : "⚡ Your readiness score indicates prime neurological state. Focus on controlled eccentric tempo (3 seconds down) on the primary movements!"
    };
  },

  /**
   * Generates proactive timed nutrition schedule tailored to user profile
   */
  getProactiveNutritionSchedule(profile) {
    const dietaryStyle = profile.dietaryStyle || 'high_protein';
    const goal = profile.primaryGoal || 'muscle';
    const energyWindow = profile.peakEnergyWindow || 'morning';

    // Tailored meal templates by diet
    const MEAL_DATABASE = {
      high_protein: {
        breakfast: {
          title: 'Power Protein Oats & Berry Bowl',
          timing: '08:00 AM',
          calories: 460,
          protein: 38,
          carbs: 52,
          fat: 10,
          ingredients: ['60g Rolled Oats', '1 scoop Whey/Casein Protein', '100g Wild Blueberries', '15g Chia Seeds', 'Unsweetened Almond Milk'],
          prepTime: '5 mins',
          aiWhy: 'Slow-digesting complex carbs with fast leucine-rich protein to kickstart muscle protein synthesis.'
        },
        preWorkout: {
          title: energyWindow === 'morning' ? 'Pre-Dawn Glycogen Fuel' : 'Pre-Workout Energy Surge',
          timing: energyWindow === 'morning' ? '06:30 AM' : (energyWindow === 'midday' ? '11:45 AM' : '04:45 PM'),
          calories: 240,
          protein: 16,
          carbs: 40,
          fat: 3,
          ingredients: ['1 Rice Cake with 1 tbsp Natural Honey', '1 Medium Banana', '150g Low-fat Greek Yogurt'],
          prepTime: '2 mins',
          aiWhy: 'Rapidly absorbing simple carbohydrates to elevate blood glucose and cellular ATP right before training.'
        },
        postWorkout: {
          title: 'Anabolic Recovery Shake & Rice Cake',
          timing: energyWindow === 'morning' ? '08:45 AM' : (energyWindow === 'midday' ? '01:45 PM' : '06:45 PM'),
          calories: 380,
          protein: 42,
          carbs: 45,
          fat: 4,
          ingredients: ['1.5 scoops Whey Isolate', '250ml Coconut Water', '30g Cream of Rice / Tart Cherry extract', '1 pinch Sea Salt'],
          prepTime: '3 mins',
          aiWhy: 'Electrolyte rehydration + 40g ultra-fast hydrolysate for glycogen replenishment & reduced DOMS soreness.'
        },
        lunch: {
          title: 'Grilled Lemon Herb Chicken Quinoa Bowl',
          timing: '01:00 PM',
          calories: 580,
          protein: 52,
          carbs: 55,
          fat: 16,
          ingredients: ['180g Grilled Chicken Breast', '120g Cooked Quinoa', 'Steamed Asparagus & Baby Spinach', '1 tbsp Extra Virgin Olive Oil & Lemon'],
          prepTime: '15 mins',
          aiWhy: 'Rich in zinc, iron, and complete amino acids for sustained mid-day focus without insulin crashes.'
        },
        dinner: {
          title: 'Wild Salmon with Roasted Sweet Potato & Greens',
          timing: '07:30 PM',
          calories: 620,
          protein: 46,
          carbs: 48,
          fat: 24,
          ingredients: ['200g Wild Alaskan Salmon', '180g Baked Sweet Potato', 'Charred Broccoli with Garlic', '1 tbsp Grass-fed Ghee'],
          prepTime: '20 mins',
          aiWhy: 'High Omega-3 fatty acids (EPA/DHA) to suppress systemic inflammation and promote deep Stage 3 recovery sleep.'
        },
        snack: {
          title: 'Casein Pudding with Almond Flakes',
          timing: '09:30 PM',
          calories: 220,
          protein: 26,
          carbs: 8,
          fat: 9,
          ingredients: ['1 scoop Micellar Casein', '15g Crushed Almonds', 'Cinnamon dusting'],
          prepTime: '2 mins',
          aiWhy: 'Slow 7-hour amino acid release to stop overnight muscular catabolism.'
        }
      },
      vegan: {
        breakfast: {
          title: 'Super Green Tofu Scramble with Sourdough',
          timing: '08:00 AM',
          calories: 440,
          protein: 32,
          carbs: 46,
          fat: 14,
          ingredients: ['200g Firm Tofu (crumbled)', '2 slices Artisan Sourdough', 'Nutritional Yeast (B12)', 'Baby Spinach & Turmeric'],
          prepTime: '10 mins',
          aiWhy: 'Plant-based amino profile with methylated B-vitamins and anti-inflammatory turmeric.'
        },
        preWorkout: {
          title: 'Medjool Dates with Almond Butter',
          timing: energyWindow === 'morning' ? '06:30 AM' : '04:45 PM',
          calories: 230,
          protein: 6,
          carbs: 44,
          fat: 5,
          ingredients: ['3 Medjool Dates', '1 tbsp Pure Almond Butter', 'Pinch of Himalayan Pink Salt'],
          prepTime: '1 min',
          aiWhy: 'Nature\'s fastest natural glucose/fructose fuel with potassium to prevent exercise cramping.'
        },
        postWorkout: {
          title: 'Pea & Brown Rice Protein Smoothie Bowl',
          timing: energyWindow === 'morning' ? '08:45 AM' : '06:45 PM',
          calories: 360,
          protein: 36,
          carbs: 48,
          fat: 5,
          ingredients: ['1.5 scoops Plant Performance Protein (Pea+Rice blend)', '1 Frozen Banana', '100g Mixed Berries', 'Oat Milk'],
          prepTime: '4 mins',
          aiWhy: 'Complete 9 essential amino acids with antioxidant polyphenols for cellular repair.'
        },
        lunch: {
          title: 'Mediterranean Lentil & Edamame Power Salad',
          timing: '01:00 PM',
          calories: 540,
          protein: 38,
          carbs: 62,
          fat: 15,
          ingredients: ['150g Cooked Brown Lentils', '100g Steamed Shelled Edamame', 'Diced Cucumbers, Cherry Tomatoes', 'Tahini Lemon Dressing'],
          prepTime: '10 mins',
          aiWhy: 'High prebiotic fiber for gut microbiome health and steady low-glycemic blood sugar.'
        },
        dinner: {
          title: 'Crispy Tempeh Bowl with Sesame Broccoli & Jasmine Rice',
          timing: '07:30 PM',
          calories: 590,
          protein: 40,
          carbs: 58,
          fat: 20,
          ingredients: ['180g Fermented Tempeh Cubes', '150g Steamed Jasmine Rice', 'Broccoli Florets', 'Tamari Sesame Glaze'],
          prepTime: '15 mins',
          aiWhy: 'Fermented whole soy provides superior bioavailability and gut-friendly digestion before sleep.'
        },
        snack: {
          title: 'Roasted Crunchy Chickpeas & Pumpkin Seeds',
          timing: '09:30 PM',
          calories: 210,
          protein: 14,
          carbs: 22,
          fat: 8,
          ingredients: ['50g Spiced Roasted Chickpeas', '15g Raw Pumpkin Seeds (Zinc & Magnesium)'],
          prepTime: 'Ready to eat',
          aiWhy: 'High magnesium promotes GABA neurotransmitter release for deep sleep.'
        }
      },
      mediterranean: {
        breakfast: {
          title: 'Greek Shakshuka with Poached Eggs & Feta',
          timing: '08:00 AM',
          calories: 430,
          protein: 28,
          carbs: 32,
          fat: 22,
          ingredients: ['2 Pasture-Raised Eggs', '1 Egg White', 'Rich Tomato & Bell Pepper Ragout', '30g Crumbled Feta', '1 slice Whole Grain Toast'],
          prepTime: '12 mins',
          aiWhy: 'Lycopene antioxidants combined with bioavailable choline for neurological acuity.'
        },
        preWorkout: {
          title: 'Greek Yogurt with Fig & Honey Drizzle',
          timing: energyWindow === 'morning' ? '06:30 AM' : '04:45 PM',
          calories: 220,
          protein: 18,
          carbs: 32,
          fat: 2,
          ingredients: ['170g 0% Greek Yogurt', '2 Fresh or Dried Figs', '1 tsp Raw Wild Honey'],
          prepTime: '2 mins',
          aiWhy: 'Easy-to-digest dairy protein with sustained glycogen charge.'
        },
        postWorkout: {
          title: 'Cold Pressed Tart Cherry & Protein Elixir',
          timing: '06:45 PM',
          calories: 340,
          protein: 35,
          carbs: 42,
          fat: 3,
          ingredients: ['1.5 scoops Whey Isolate', '200ml Pure Tart Cherry Juice', 'Cold Water & Ice'],
          prepTime: '2 mins',
          aiWhy: 'Clinical dose of anthocyanins shown to reduce exercise-induced muscle damage by 30%.'
        },
        lunch: {
          title: 'Seared Tuna Nicoise Bowl with Olives & Baby Potatoes',
          timing: '01:00 PM',
          calories: 560,
          protein: 48,
          carbs: 44,
          fat: 20,
          ingredients: ['160g Yellowfin Tuna Steak', '120g Boiled Baby Red Potatoes', 'Kalamata Olives, Green Beans', 'Extra Virgin Olive Oil'],
          prepTime: '15 mins',
          aiWhy: 'Polyphenols + Lean marine protein for cardiovascular protection.'
        },
        dinner: {
          title: 'Herb Crusted Sea Bass with Roasted Ratatouille',
          timing: '07:30 PM',
          calories: 580,
          protein: 44,
          carbs: 36,
          fat: 26,
          ingredients: ['200g Wild Sea Bass Fillet', 'Zucchini, Eggplant, Bell Peppers in Olive Oil', 'Herbs de Provence'],
          prepTime: '20 mins',
          aiWhy: 'Gentle on stomach, optimal heart-healthy monounsaturated fats.'
        },
        snack: {
          title: 'Walnut Halves & Dark Chocolate (85%)',
          timing: '09:30 PM',
          calories: 200,
          protein: 6,
          carbs: 12,
          fat: 16,
          ingredients: ['20g Raw Walnuts', '15g 85% Dark Chocolate'],
          prepTime: 'Instant',
          aiWhy: 'Flavanols and ALA omega-3 support overnight cellular repair.'
        }
      },
      keto: {
        breakfast: {
          title: 'Avocado Baked Eggs with Smoked Salmon',
          timing: '08:00 AM',
          calories: 510,
          protein: 34,
          carbs: 6,
          fat: 38,
          ingredients: ['1 Whole Ripe Avocado', '2 Pasture-Raised Eggs', '60g Smoked Salmon', 'Everything Bagel Seasoning'],
          prepTime: '10 mins',
          aiWhy: 'High healthy monounsaturated fat and potassium to sustain deep ketosis.'
        },
        preWorkout: {
          title: 'MCT Oil Ketone Coffee + Salt Pinch',
          timing: '06:30 AM',
          calories: 180,
          protein: 2,
          carbs: 1,
          fat: 20,
          ingredients: ['Fresh Espresso / Black Coffee', '1 tbsp C8 MCT Oil', '1/4 tsp Sea Salt (Sodium)'],
          prepTime: '2 mins',
          aiWhy: 'C8 caprylic acid rapidly converts to liver ketone bodies for non-glycogen workout power.'
        },
        postWorkout: {
          title: 'Zero-Carb Isolate & Collagen Cream Shake',
          timing: '08:45 AM',
          calories: 320,
          protein: 40,
          carbs: 2,
          fat: 16,
          ingredients: ['1.5 scoops Pure Whey Isolate (0g carb)', '30ml Heavy Whipping Cream', '10g Grass-Fed Collagen Peptides'],
          prepTime: '2 mins',
          aiWhy: 'Zero insulin spike while triggering rapid myofibrillar protein synthesis.'
        },
        lunch: {
          title: 'Cobb Salad with Bacon, Blue Cheese & Ranch',
          timing: '01:00 PM',
          calories: 650,
          protein: 48,
          carbs: 8,
          fat: 48,
          ingredients: ['150g Grilled Chicken Thighs', '2 slices Crispy Bacon', '1 Boiled Egg', '30g Blue Cheese, Mixed Greens, Avocado Oil Ranch'],
          prepTime: '12 mins',
          aiWhy: 'Dense satiety without blood sugar fluctuation.'
        },
        dinner: {
          title: 'Grass-Fed Ribeye with Garlic Butter Asparagus',
          timing: '07:30 PM',
          calories: 720,
          protein: 54,
          carbs: 5,
          fat: 52,
          ingredients: ['220g Grass-Fed Ribeye Steak', '2 tbsp Grass-fed Herb Butter', 'Grilled Asparagus Spears'],
          prepTime: '15 mins',
          aiWhy: 'Heme iron, carnitine, and zinc for hormone synthesis and deep recovery.'
        },
        snack: {
          title: 'Macadamia Nut & Salt Crunch',
          timing: '09:30 PM',
          calories: 220,
          protein: 3,
          carbs: 4,
          fat: 23,
          ingredients: ['30g Raw Macadamia Nuts', 'Flaky Sea Salt'],
          prepTime: 'Instant',
          aiWhy: 'Lowest carb nut profile with dense satiating oleic acids.'
        }
      }
    };

    const dietKey = MEAL_DATABASE[dietaryStyle] ? dietaryStyle : 'high_protein';
    const meals = MEAL_DATABASE[dietKey];

    return {
      dietaryStyle: dietKey,
      meals: [
        { id: 'meal_breakfast', type: 'breakfast', ...meals.breakfast },
        { id: 'meal_pre', type: 'preWorkout', ...meals.preWorkout },
        { id: 'meal_post', type: 'postWorkout', ...meals.postWorkout },
        { id: 'meal_lunch', type: 'lunch', ...meals.lunch },
        { id: 'meal_dinner', type: 'dinner', ...meals.dinner },
        { id: 'meal_snack', type: 'snack', ...meals.snack }
      ]
    };
  },

  /**
   * Generates intelligent Pantry Food Swaps when a user is missing ingredients or wants an alternative
   */
  generatePantrySwap(targetMeal, userPantryIngredients = '', userProfile = {}) {
    const defaultProtein = targetMeal?.protein || 40;
    const defaultCarbs = targetMeal?.carbs || 45;
    const defaultFat = targetMeal?.fat || 15;
    const targetCalories = targetMeal?.calories || 480;

    const query = userPantryIngredients.toLowerCase().trim();

    // Contextual swap logic based on common user ingredients
    if (query.includes('egg') || query.includes('eggs')) {
      return {
        title: 'Calibrated Farm Egg & Toast Scramble',
        servings: '1 Person',
        calories: targetCalories,
        protein: defaultProtein,
        carbs: defaultCarbs,
        fat: defaultFat,
        matchedIngredients: [
          `3 Large Whole Eggs + 2 Egg Whites (${Math.round(defaultProtein * 0.85)}g protein)`,
          `${Math.max(1, Math.round(defaultCarbs / 22))} slices Whole Grain / Sourdough Bread`,
          '1 cup Handful of Greens or Tomato slices',
          '1 tsp Cooking Olive Oil or Butter'
        ],
        prepInstructions: [
          '1. Whisk whole eggs with egg whites and a pinch of salt/pepper.',
          '2. Lightly grease skillet over medium heat; scramble for 90 seconds until soft curds form.',
          '3. Toast bread slices and serve immediately.'
        ],
        aiCoachRationale: `Swapped original meal for eggs while matching your exact ${defaultProtein}g protein target using an egg-white ratio to keep fats precisely aligned with your metabolic goals.`
      };
    } else if (query.includes('tuna') || query.includes('canned fish')) {
      return {
        title: 'Express Pantry Tuna Power Salad',
        servings: '1 Person',
        calories: targetCalories,
        protein: defaultProtein,
        carbs: defaultCarbs,
        fat: defaultFat,
        matchedIngredients: [
          `1.5 cans (180g drained) Chunk Light Tuna in Water (${defaultProtein}g protein)`,
          `${Math.round(defaultCarbs * 2.5)}g Cooked Rice, Crackers or Baked Potato`,
          '1 tbsp Greek yogurt or light mayo + Lemon juice',
          'Diced pickles, celery, or salad greens'
        ],
        prepInstructions: [
          '1. Drain tuna thoroughly.',
          '2. Mix with Greek yogurt, lemon juice, black pepper, and diced veggies.',
          '3. Serve over your carb base for instant zero-cook fuel.'
        ],
        aiCoachRationale: `Canned tuna is 95% pure bioavailable protein. This swap preserves your macro split with zero prep time!`
      };
    } else if (query.includes('tofu') || query.includes('edamame') || query.includes('beans')) {
      return {
        title: 'Quick Spiced Plant-Protein Skillet',
        servings: '1 Person',
        calories: targetCalories,
        protein: defaultProtein,
        carbs: defaultCarbs,
        fat: defaultFat,
        matchedIngredients: [
          `220g Extra Firm Tofu or Tempeh (cubed)`,
          `1 cup Cooked Black Beans or Edamame`,
          `${Math.round(defaultCarbs * 1.8)}g Jasmine Rice or Quinoa`,
          'Soy sauce, garlic powder, and paprika'
        ],
        prepInstructions: [
          '1. Press tofu with paper towel and dice into 1-inch cubes.',
          '2. Sear in pan over high heat with soy sauce and spices for 6 mins until crispy.',
          '3. Toss with edamame/beans and serve hot over rice.'
        ],
        aiCoachRationale: `Combines soy isoflavones with legumes to form a complete branched-chain amino acid (BCAA) profile.`
      };
    } else {
      // General dynamic swap
      return {
        title: `AI Custom Smart Swap for "${userPantryIngredients || 'Available Pantry'}"`,
        servings: '1 Person',
        calories: targetCalories,
        protein: defaultProtein,
        carbs: defaultCarbs,
        fat: defaultFat,
        matchedIngredients: [
          `Primary Protein Source: ${Math.round(defaultProtein * 4.5)}g portion to hit ${defaultProtein}g target`,
          `Carbohydrate Base: ${Math.round(defaultCarbs * 2.2)}g complex carbs (oats, potato, rice, or wrap)`,
          `Healthy Fats: ${Math.round(defaultFat * 1.1)}g (olive oil, nuts, or seeds)`,
          'Generous seasoning (garlic, herbs, sea salt)'
        ],
        prepInstructions: [
          '1. Cook your primary protein with minimal added oils to protect macro balance.',
          '2. Pair with your measured carbohydrate base.',
          '3. Add leafy greens or seasonal vegetables for micronutrient density.'
        ],
        aiCoachRationale: `AI calibrated portion sizing to keep your total intake at exactly ${targetCalories} kcal and ${defaultProtein}g protein without breaking your daily stride.`
      };
    }
  },

  /**
   * Generates AI Coach responses with streaming token simulation
   */
  async processCoachQuery(query, userProfile = {}, onTokenCallback = null) {
    const q = query.toLowerCase();
    let fullResponse = "";
    let quickSuggestions = [];

    if (q.includes('what should i workout') || q.includes('workout today') || q.includes('routine')) {
      const routine = this.generateWorkout({ focus: 'full_body', duration: 30 }, userProfile);
      fullResponse = `🔥 **Today's AI Recommended Routine: ${routine.title}**\n\n` +
        `Based on your **${userProfile.primaryGoal || 'fitness'}** goal and **${userProfile.equipmentAvailable || 'dumbbell'}** setup, here is your high-impact session:\n\n` +
        `**⏱️ Duration:** ${routine.durationMinutes} mins | **⚡ Intensity:** ${routine.intensity}\n\n` +
        `### Warm-Up (3 mins):\n` +
        routine.warmup.map(w => `• ${w}`).join('\n') + `\n\n` +
        `### Main Working Sets:\n` +
        routine.exercises.map((ex, i) => `**${i+1}. ${ex.name}** — ${ex.sets} sets × ${ex.reps} (Rest: ${ex.rest}s)\n   *Cue: ${ex.cue}*`).join('\n\n') + `\n\n` +
        `> 💡 **AI Form Focus:** ${routine.aiCoachNote}\n\n` +
        `*Would you like me to start the guided timer for this workout?*`;
      
      quickSuggestions = [
        "Start this workout now",
        "Make it a 15-minute quick sweat",
        "Focus on Upper Body only",
        "I'm feeling sore today"
      ];
    } else if (q.includes('sore') || q.includes('pain') || q.includes('back') || q.includes('knee') || q.includes('injury') || q.includes('shoulder')) {
      let area = "muscles";
      if (q.includes('back')) area = "lower back";
      if (q.includes('knee')) area = "knees";
      if (q.includes('shoulder')) area = "shoulders";
      if (q.includes('hip')) area = "hips";

      fullResponse = `🛡️ **AI Recovery & Injury Protocol: ${area.toUpperCase()}**\n\n` +
        `I hear you! Training through sharp joint pain causes compensation, while mild DOMS (muscle soreness) responds best to active blood flow.\n\n` +
        `### Immediate Action Protocol:\n` +
        `1. **Regulate Load:** Reduce spinal/joint axial loading today. Swap heavy compounds for isometric holds or bodyweight flows.\n` +
        `2. **Targeted Mobility Decompression:**\n` +
        `   • **Cat-Cow Breathing:** 10 slow cycles with deep diaphragmatic expansion.\n` +
        `   • **World's Greatest Stretch:** 5 reps per side with 3-second rotation hold.\n` +
        `   • **90/90 Hip Flow:** Gentle oscillation to unglue tight hip capsules.\n` +
        `3. **Hydration & Electrolytes:** Increase sodium/potassium intake by 15% to enhance cellular fluid exchange.\n` +
        `4. **Sleep Optimization:** Take 300mg Magnesium Glycinate 45 mins before bed to downregulate nervous system tone.\n\n` +
        `*Should I generate a 15-minute gentle mobility routine to relieve this?*`;

      quickSuggestions = [
        "Generate 15-min gentle mobility",
        "How to relieve lower back tightness",
        "Should I take a complete rest day?",
        "Post-workout recovery meal"
      ];
    } else if (q.includes('squat') || q.includes('form tip') || q.includes('deadlift') || q.includes('bench press') || q.includes('pushup')) {
      let exerciseName = "Squat";
      if (q.includes('deadlift')) exerciseName = "Deadlift";
      if (q.includes('bench')) exerciseName = "Bench Press";
      if (q.includes('pushup')) exerciseName = "Push-Up";

      const guides = {
        Squat: {
          keyCues: [
            "**Tripod Foot:** Grip the floor with big toe, pinky toe, and heel.",
            "**Knee Trajectory:** Push knees outward in the exact direction your toes are pointing.",
            "**Bracing:** Inhale into your belly (360 degrees) and hold pressure down into your pelvis before descending.",
            "**Depth:** Descend until hip crease is level with or just below top of knee."
          ],
          commonFault: "Knees collapsing inward (valgus) or heels lifting off the ground.",
          quickFix: "Place a light mini-band above your knees or elevate heels on small 5lb plates."
        },
        Deadlift: {
          keyCues: [
            "**Bar Path:** Keep bar brushing against shins and thighs in a straight vertical line.",
            "**Lat Engagement:** Squeeze armpits shut like protecting a hundred-dollar bill.",
            "**Hip Hinge:** Push your butt backward toward the wall rather than squatting down.",
            "**Lockout:** Squeeze glutes at top without hyperextending your lower back."
          ],
          commonFault: "Rounding upper/lower back as the bar breaks off the floor.",
          quickFix: "Set your chest up high and take the 'slack' out of the bar before pushing the floor away."
        },
        'Bench Press': {
          keyCues: [
            "**Scapular Retraction:** Pinch shoulder blades back and down into the bench.",
            "**Elbow Angle:** Keep elbows tucked at 45 to 60 degrees (arrowhead, not T-shape).",
            "**Leg Drive:** Drive heels firmly down into the floor throughout the press.",
            "**Bar Path:** Lower bar to lower sternum, press back up in a slight curve over shoulders."
          ],
          commonFault: "Flaring elbows out at 90 degrees which impinges shoulder joints.",
          quickFix: "Narrow grip slightly and think about bending the bar in half."
        },
        'Push-Up': {
          keyCues: [
            "**Plank Alignment:** Ears, shoulders, hips, and ankles in one rigid line.",
            "**Glute & Quad Squeeze:** Lock legs straight to prevent lower back sagging.",
            "**Hand Placement:** Slightly wider than shoulder-width, fingers spread.",
            "**Full ROM:** Chest taps floor, push until shoulder blades wrap forward at top."
          ],
          commonFault: "Neck craning forward or hips sagging toward the ground.",
          quickFix: "Perform hands-elevated pushups on a bench until core strength is rock-solid."
        }
      };

      const guide = guides[exerciseName] || guides.Squat;

      fullResponse = `🎯 **AI Biomechanical Masterclass: The ${exerciseName}**\n\n` +
        `Here are the golden technique cues to maximize muscle recruitment and safeguard your joints:\n\n` +
        guide.keyCues.join('\n') + `\n\n` +
        `⚠️ **Most Common Mistake:**\n${guide.commonFault}\n\n` +
        `🛠️ **Instant AI Fix:**\n${guide.quickFix}\n\n` +
        `*Would you like a warm-up drill to prime this movement?*`;

      quickSuggestions = [
        "Warm-up drill for " + exerciseName,
        "Suggest a 20-min routine",
        "Form tip for Deadlift",
        "What should I eat post-workout?"
      ];
    } else if (q.includes('eat') || q.includes('nutrition') || q.includes('food') || q.includes('meal') || q.includes('snack') || q.includes('protein')) {
      const targets = userProfile.targets || { targetCalories: 2200, targetProtein: 165, targetCarbs: 230, targetFat: 60 };
      fullResponse = `🥗 **AI Precision Nutrition Insight**\n\n` +
        `Based on your goal to **${userProfile.primaryGoal || 'build muscle'}** and dietary preference (**${userProfile.dietaryStyle || 'high protein'}**), here is your optimal fueling strategy:\n\n` +
        `📊 **Daily Target:** **${targets.targetCalories} kcal** | **${targets.targetProtein}g Protein** | **${targets.targetCarbs}g Carbs** | **${targets.targetFat}g Fats**\n\n` +
        `### Timing Recommendation Right Now:\n` +
        `• **Pre-Workout Window (60 mins prior):** 30-40g fast-digesting carbs (banana, rice cakes with honey, or fruit smoothie) with 15-20g light protein.\n` +
        `• **Post-Workout Recovery (within 45 mins):** 35-45g high-leucine protein (whey/plant isolate, Greek yogurt, or chicken breast) to maximize muscle protein synthesis.\n` +
        `• **Hydration Target:** Aim for ${targets.waterTarget || 2800} mL of water today with added electrolytes if training hard.\n\n` +
        `*Have specific ingredients at home? Tell me what you have in your fridge and I will build an instant swap!*`;

      quickSuggestions = [
        "I have eggs and avocado, swap meal",
        "Best 5-minute pre-workout snack",
        "Suggest high protein dinner",
        "How much water should I drink?"
      ];
    } else {
      // General coaching intelligence
      fullResponse = `⚡ **FitAI Smart AI Coach Advice**\n\n` +
        `Great question, **${userProfile.name || 'Athlete'}**! For your goal of **${userProfile.primaryGoal || 'fitness'}**:\n\n` +
        `• **Consistency over Perfection:** Daily adherence to your calculated schedule will compound faster than sporadic high-intensity efforts.\n` +
        `• **Progressive Stimulus:** Ensure you either add 1 rep, improve form tempo, or increase load every week.\n` +
        `• **Recovery Anchor:** Muscle tissue is broken down in the gym and built during Stage 3 deep sleep with adequate amino acid availability.\n\n` +
        `How else can I assist your training or meal plan today?`;

      quickSuggestions = [
        "What should I workout today?",
        "Suggest a 20-min routine",
        "Form tip for squats",
        "What should I eat post-workout?"
      ];
    }

    // If streaming callback provided, simulate realistic word-by-word streaming
    if (onTokenCallback) {
      const words = fullResponse.split(' ');
      let accumulated = "";
      for (let i = 0; i < words.length; i++) {
        accumulated += (i > 0 ? " " : "") + words[i];
        onTokenCallback(accumulated, i === words.length - 1);
        await new Promise(r => setTimeout(r, 18)); // Smooth typing simulation
      }
    }

    return {
      text: fullResponse,
      quickSuggestions
    };
  }
};
