import json

with open("items copy.json", "r") as f:
    data = json.load(f)

for item in data:
    if 'bonus' in item:
        for skill, bonuses in item['bonus'].items():
            transformed_bonuses = {}
            for bonus_key, bonus_value in bonuses.items():
                if 'Percent' in bonus_key:
                    # Extract the base name of the stat (e.g., "strength" from "strengthPercent")
                    stat_name = bonus_key.replace('Percent', '')
                    transformed_bonuses.setdefault(stat_name, {}).update({'percent': bonus_value})
                else:
                    # Handle absolute bonuses
                    transformed_bonuses.setdefault(bonus_key, {}).update({'absolute': bonus_value})
            # Replace the original bonuses with the transformed structure
            item['bonus'][skill] = transformed_bonuses

with open("items2.json", "w") as f:
    json.dump(data, f)