from django.core.management.base import BaseCommand

from missions.models import LearningTopic, QuizQuestion

TOPICS = [
    {
        "topic": "POWER",
        "title": "Power",
        "article_summary": (
            "Every outpost needs a steady power supply. Solar panels are the go-to source for "
            "both the Moon and Mars, but each world brings its own challenges: lunar nights last "
            "about 14 Earth days with no sunlight at all, while Mars is farther from the Sun and "
            "can suffer week-long dust storms that block panels for extended periods. Missions "
            "plan around this with battery banks, fuel cells, or small nuclear generators (RTGs) "
            "as backup."
        ),
        "nasa_reference_url": "https://science.nasa.gov/",
        "youtube_url": "https://www.youtube.com/watch?v=SGP6Y0Pnhe4",
        "questions": [
            {
                "prompt": "Why is solar power harder to rely on for a Mars mission than a Moon mission near the equator?",
                "choice_a": "Mars is farther from the Sun and can have long dust storms",
                "choice_b": "Mars has no gravity to hold panels down",
                "choice_c": "Mars has too much oxygen in its atmosphere",
                "choice_d": "Solar panels cannot function in cold temperatures",
                "correct_choice": "A",
                "explanation": "Mars receives less sunlight than the Moon, and dust storms can block sunlight for extended periods.",
            },
            {
                "prompt": "How long does a single lunar night last, cutting off solar power at most landing sites?",
                "choice_a": "About 24 hours",
                "choice_b": "About 14 Earth days",
                "choice_c": "About 1 Earth year",
                "choice_d": "Lunar nights don't exist",
                "correct_choice": "B",
                "explanation": "A full lunar day-night cycle is about 29.5 Earth days, so night lasts roughly 14 days.",
            },
            {
                "prompt": "What is a common backup power source when solar panels can't produce enough energy?",
                "choice_a": "Battery banks or radioisotope generators (RTGs)",
                "choice_b": "Burning oxygen reserves",
                "choice_c": "Wind turbines",
                "choice_d": "There is no backup — missions simply pause",
                "correct_choice": "A",
                "explanation": "Batteries store excess daytime power, and RTGs provide steady power independent of sunlight.",
            },
            {
                "prompt": "Why might mission planners choose a landing site near the Moon's poles for power reasons?",
                "choice_a": "Some polar ridges receive near-constant sunlight",
                "choice_b": "Poles have stronger gravity",
                "choice_c": "Poles are closer to the Sun",
                "choice_d": "Solar panels work better in the dark",
                "correct_choice": "A",
                "explanation": "Certain lunar polar ridges are sunlit almost year-round, dramatically reducing power gaps.",
            },
            {
                "prompt": "What effect do Martian dust storms have on solar-powered equipment?",
                "choice_a": "They clean dust off the panels automatically",
                "choice_b": "They can block sunlight for days or weeks, cutting power output",
                "choice_c": "They increase panel efficiency",
                "choice_d": "They have no measurable effect",
                "correct_choice": "B",
                "explanation": "Global dust storms on Mars can last weeks and severely reduce the sunlight reaching solar panels.",
            },
        ],
    },
    {
        "topic": "LIFE_SUPPORT",
        "title": "Life Support",
        "article_summary": (
            "Life support keeps a crew alive in an environment with no breathable air: it recycles "
            "oxygen and water, scrubs carbon dioxide, and maintains cabin pressure and temperature. "
            "On the International Space Station, systems like the Water Recovery System reclaim "
            "moisture from breath and even urine, cutting down on how much needs to be resupplied "
            "from Earth — a lesson that scales directly to Moon and Mars outposts."
        ),
        "nasa_reference_url": "https://www.nasa.gov/humans-in-space/",
        "youtube_url": "https://www.youtube.com/watch?v=fH89Fr13y84",
        "questions": [
            {
                "prompt": "What is the main purpose of a life support system on a space outpost?",
                "choice_a": "To provide breathable air, clean water, and stable temperature/pressure",
                "choice_b": "To generate extra electrical power",
                "choice_c": "To launch resupply rockets",
                "choice_d": "To communicate with Earth",
                "correct_choice": "A",
                "explanation": "Life support covers the basics a crew needs to survive: air, water, temperature, and pressure.",
            },
            {
                "prompt": "Why do modern space life support systems recycle water from crew breath and sweat?",
                "choice_a": "To reduce how much water must be resupplied from Earth",
                "choice_b": "Recycled water tastes better",
                "choice_c": "It's required for radiation shielding",
                "choice_d": "It has no real benefit",
                "correct_choice": "A",
                "explanation": "Every kilogram launched from Earth is expensive, so recycling water drastically cuts resupply needs.",
            },
            {
                "prompt": "What gas must life support systems continuously remove from a sealed habitat's air?",
                "choice_a": "Carbon dioxide, which builds up as the crew breathes",
                "choice_b": "Helium",
                "choice_c": "Argon",
                "choice_d": "Hydrogen",
                "correct_choice": "A",
                "explanation": "CO2 scrubbers remove the carbon dioxide crew members exhale, preventing it from reaching unsafe levels.",
            },
            {
                "prompt": "What would likely happen first if a habitat's life support system failed?",
                "choice_a": "Nothing — habitats don't depend on it",
                "choice_b": "Breathable air and pressure would be lost, endangering the crew quickly",
                "choice_c": "The habitat would get more sunlight",
                "choice_d": "Food production would increase",
                "correct_choice": "B",
                "explanation": "Loss of pressure or breathable air is one of the most immediate threats to a crew's survival.",
            },
            {
                "prompt": "Why is life support especially critical for a Mars mission compared to a quick Moon trip?",
                "choice_a": "Mars missions are much longer, so systems must run reliably for months",
                "choice_b": "Mars has breathable air already",
                "choice_c": "Life support isn't needed on Mars",
                "choice_d": "Mars missions never leave the spacecraft",
                "correct_choice": "A",
                "explanation": "Longer mission durations mean life support hardware must be more durable and self-sufficient.",
            },
        ],
    },
    {
        "topic": "RADIATION_SHIELDING",
        "title": "Radiation Shielding",
        "article_summary": (
            "Without Earth's thick atmosphere and magnetic field, astronauts on the Moon or Mars are "
            "exposed to far more cosmic radiation and solar particle events. Mission designers reduce "
            "this risk with shielding — thick regolith (soil) coverings, water-filled walls, or "
            "underground/lava-tube habitats — and by timing risky activities around solar weather."
        ),
        "nasa_reference_url": "https://science.nasa.gov/",
        "youtube_url": "https://www.youtube.com/watch?v=5nSxFbDVlo8",
        "questions": [
            {
                "prompt": "Why are astronauts on the Moon or Mars exposed to more radiation than people on Earth?",
                "choice_a": "They lack Earth's protective atmosphere and magnetic field",
                "choice_b": "The Moon and Mars produce their own harmful radiation",
                "choice_c": "Spacesuits attract radiation",
                "choice_d": "Radiation levels are actually lower in space",
                "correct_choice": "A",
                "explanation": "Earth's atmosphere and magnetosphere block most cosmic and solar radiation that reaches other worlds unfiltered.",
            },
            {
                "prompt": "What material is commonly proposed for shielding habitats because it's already on-site?",
                "choice_a": "Imported steel",
                "choice_b": "Regolith (loose surface soil and rock)",
                "choice_c": "Glass",
                "choice_d": "Aluminum foil only",
                "correct_choice": "B",
                "explanation": "Piling regolith over or around a habitat is a mass-efficient way to block radiation without launching extra material.",
            },
            {
                "prompt": "Why might astronauts shelter in lava tubes or underground structures during a mission?",
                "choice_a": "They offer natural, thick shielding against radiation",
                "choice_b": "They provide extra sunlight",
                "choice_c": "They generate power",
                "choice_d": "They are warmer than the surface",
                "correct_choice": "A",
                "explanation": "Underground spaces like lava tubes have rock overhead that naturally blocks a large amount of radiation.",
            },
            {
                "prompt": "What is a 'solar particle event' that mission planners must watch for?",
                "choice_a": "A burst of high-energy particles from the Sun that raises radiation risk",
                "choice_b": "A scheduled resupply launch",
                "choice_c": "A type of lunar eclipse",
                "choice_d": "A routine software update",
                "correct_choice": "A",
                "explanation": "Solar particle events can spike radiation exposure sharply, so missions plan shelter time around them.",
            },
            {
                "prompt": "Why is water sometimes used as a radiation shield in spacecraft walls?",
                "choice_a": "Water is effective at absorbing radiation and is already needed for the crew",
                "choice_b": "Water reflects all radiation instantly",
                "choice_c": "Water increases radiation exposure",
                "choice_d": "It has no shielding effect",
                "correct_choice": "A",
                "explanation": "Water is a decent radiation absorber and doing double duty as both a drinking supply and shield saves mass.",
            },
        ],
    },
    {
        "topic": "FOOD",
        "title": "Food Production",
        "article_summary": (
            "Long-duration missions can't rely only on resupply from Earth, so growing food on-site "
            "is a major research focus. NASA's Veggie and Advanced Plant Habitat experiments on the "
            "ISS test growing leafy greens in microgravity, and similar controlled-environment systems "
            "are planned for lunar and Martian greenhouses to supplement stored rations."
        ),
        "nasa_reference_url": "https://www.nasa.gov/humans-in-space/",
        "youtube_url": "https://www.youtube.com/watch?v=-BbRF_aIoz4",
        "questions": [
            {
                "prompt": "Why is growing food on-site important for long Moon or Mars missions?",
                "choice_a": "It reduces dependence on expensive resupply missions from Earth",
                "choice_b": "It generates electrical power",
                "choice_c": "It replaces the need for life support",
                "choice_d": "Plants cannot grow in space at all",
                "correct_choice": "A",
                "explanation": "The longer a mission lasts, the more expensive and impractical it becomes to ship all food from Earth.",
            },
            {
                "prompt": "What NASA experiment has tested growing leafy greens aboard the ISS?",
                "choice_a": "The Veggie plant growth system",
                "choice_b": "The Hubble Space Telescope",
                "choice_c": "The Orion capsule",
                "choice_d": "The Mars rover Curiosity",
                "correct_choice": "A",
                "explanation": "Veggie is a small chamber on the ISS used to grow and study leafy greens in microgravity.",
            },
            {
                "prompt": "What is one major challenge for growing plants on Mars compared to Earth?",
                "choice_a": "Weak sunlight, thin atmosphere, and soil that needs treatment before use",
                "choice_b": "Too much rainfall",
                "choice_c": "Excess oxygen in the soil",
                "choice_d": "There are no challenges — Martian soil is identical to Earth's",
                "correct_choice": "A",
                "explanation": "Martian regolith lacks key nutrients and may contain perchlorates, and sunlight/atmosphere differ greatly from Earth's.",
            },
            {
                "prompt": "Why do mission planners favor controlled-environment greenhouses over open-air farming?",
                "choice_a": "Greenhouses let planners control light, temperature, and air precisely",
                "choice_b": "Open-air farming works better on the Moon",
                "choice_c": "Greenhouses eliminate the need for water",
                "choice_d": "There is no difference between the two approaches",
                "correct_choice": "A",
                "explanation": "Controlled environments let growers fine-tune conditions since neither the Moon nor Mars has breathable outdoor air.",
            },
            {
                "prompt": "Besides nutrition, what psychological benefit has crew gardening shown on the ISS?",
                "choice_a": "It can boost morale and give astronauts a sense of connection to Earth",
                "choice_b": "It eliminates the need for sleep",
                "choice_c": "It increases radiation exposure",
                "choice_d": "It has shown no psychological effects",
                "correct_choice": "A",
                "explanation": "Astronauts have reported that tending plants is a welcome, grounding activity during long missions.",
            },
        ],
    },
]


class Command(BaseCommand):
    help = "Seeds the four learning topics (power, life support, radiation, food) and their quiz questions."

    def handle(self, *args, **options):
        for topic_data in TOPICS:
            questions = topic_data.pop("questions")
            topic, created = LearningTopic.objects.update_or_create(
                topic=topic_data["topic"], defaults=topic_data,
            )
            topic.questions.all().delete()
            for q in questions:
                QuizQuestion.objects.create(topic=topic, **q)
            verb = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{verb} topic: {topic.title} ({len(questions)} questions)"))

        self.stdout.write(self.style.SUCCESS("Seed complete."))
