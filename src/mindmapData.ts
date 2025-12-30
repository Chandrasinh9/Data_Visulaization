export interface MindmapNode {
  id: string;
  name: string;
  description?: string;
  summary?: string;
  children?: MindmapNode[];
  value?: number;
  expanded?: boolean;
}

export const sampleMindmapData: MindmapNode = {
  id: 'root',
  name: 'Vitamins in Human Body',
  description: 'Essential micronutrients required for normal metabolic function',
  summary: 'Vital for diverse bodily processes including energy production, immune defense, and cellular repair',
  children: [
    {
      id: 'classification',
      name: 'Vitamin Classification',
      description: 'Categorization based on solubility and chemical properties',
      summary: 'Determines absorption, storage, and excretion mechanisms in the body',
      children: [
        {
          id: 'fat-soluble',
          name: 'Fat-Soluble',
          description: 'Vitamins A, D, E, and K',
          summary: 'Stored in fatty tissues and liver; can accumulate to toxic levels',
          children: [
            { 
              id: 'vitamin-a', 
              name: 'Vitamin A',
              description: 'Retinol - Essential for vision and immune function',
              summary: 'Found in liver, carrots, sweet potatoes, and dairy products'
            },
            { 
              id: 'vitamin-d', 
              name: 'Vitamin D',
              description: 'Calciferol - Regulates calcium absorption',
              summary: 'Produced in skin via sunlight; found in fatty fish and fortified foods'
            },
            { 
              id: 'vitamin-e', 
              name: 'Vitamin E',
              description: 'Tocopherol - Potent antioxidant',
              summary: 'Protects cells from damage; found in nuts, seeds, and vegetable oils'
            },
            { 
              id: 'vitamin-k', 
              name: 'Vitamin K',
              description: 'Phylloquinone - Blood clotting factor',
              summary: 'Crucial for bone metabolism; found in leafy green vegetables'
            }
          ]
        },
        {
          id: 'water-soluble',
          name: 'Water-Soluble',
          description: 'B-complex vitamins and Vitamin C',
          summary: 'Not easily stored; excess amounts excreted through urine',
          children: [
            { 
              id: 'vitamin-c', 
              name: 'Vitamin C',
              description: 'Ascorbic Acid - Powerful antioxidant',
              summary: 'Essential for collagen synthesis and immune function'
            },
            { 
              id: 'b-complex', 
              name: 'B-Complex',
              description: 'Group of 8 water-soluble vitamins',
              summary: 'Vital for energy metabolism and red blood cell formation'
            }
          ]
        }
      ]
    },
    {
      id: 'roles',
      name: 'Key Bodily Roles',
      description: 'Critical functions across all major organ systems',
      summary: 'Act as coenzymes, antioxidants, and regulators in biochemical reactions',
      children: [
        { 
          id: 'energy-metab', 
          name: 'Energy Metabolism',
          description: 'Conversion of food to usable energy',
          summary: 'B vitamins act as coenzymes in metabolic pathways'
        },
        { 
          id: 'immune-support', 
          name: 'Immune Support',
          description: 'Enhancing immune cell function',
          summary: 'Vitamins A, C, D, E support immune defense mechanisms'
        },
        { 
          id: 'bone-health', 
          name: 'Bone Health',
          description: 'Maintaining skeletal integrity',
          summary: 'Vitamins D and K critical for calcium regulation and bone mineralization'
        },
        { 
          id: 'antioxidant', 
          name: 'Antioxidant Protection',
          description: 'Protecting cells from oxidative damage',
          summary: 'Vitamins C and E neutralize harmful free radicals'
        }
      ]
    },
    {
      id: 'sources',
      name: 'Dietary Sources',
      description: 'Primary sources of vitamins in diet',
      summary: 'Obtained through diverse food groups and environmental factors',
      children: [
        { 
          id: 'fruits-veg', 
          name: 'Fruits & Vegetables',
          description: 'Rich in Vitamin C, A, and folate',
          summary: 'Citrus fruits, berries, leafy greens, and colorful vegetables'
        },
        { 
          id: 'meat-dairy', 
          name: 'Meat & Dairy',
          description: 'Sources of B12, D, A, and K',
          summary: 'Red meat, fish, eggs, milk, and cheese products'
        },
        { 
          id: 'grains-nuts', 
          name: 'Grains & Nuts',
          description: 'Provide B vitamins and Vitamin E',
          summary: 'Whole grains, almonds, sunflower seeds, and vegetable oils'
        },
        { 
          id: 'fortified', 
          name: 'Fortified Foods',
          description: 'Enriched with additional vitamins',
          summary: 'Cereals, milk, plant-based milks, and orange juice'
        }
      ]
    },
    {
      id: 'health-impact',
      name: 'Health Impact',
      description: 'Effects of vitamin imbalances',
      summary: 'Both deficiencies and excesses can cause health problems',
      children: [
        { 
          id: 'deficiency', 
          name: 'Deficiency Effects',
          description: 'Health issues from insufficient intake',
          summary: 'Can cause fatigue, impaired vision, weakened immunity, and chronic diseases'
        },
        { 
          id: 'excess', 
          name: 'Excess Effects',
          description: 'Toxicity from overconsumption',
          summary: 'Primarily affects fat-soluble vitamins; can cause nausea and organ damage'
        }
      ]
    }
  ]
};
