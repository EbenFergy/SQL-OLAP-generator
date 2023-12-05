// attributes and dimension lists
const Address = ['Little Rock', 'Atlanta', 'Denver', 'Orlando', 'Seattle', 'Dallas', 'New York', 'Conway', 'Savannah', 'Pine Bluff'];
const Major = [
  'Computer Sc',
  'Chemistry',
  'Applied Sc',
  'Elementary Ed',
  'Information Sc',
  'Biology',
  'Economics',
  'English',
  'Accounting',
  'Business Admin',
  'Secondary Ed',
];
const Degree = ['BS', 'AS', 'MS', 'PhD', 'EdD', 'BA', 'MBA', 'MA'];
const Semester = ['S', 'F', 'Sum4', 'Sum2', 'Sum1', 'Sum3'];
const Y = [84, 92, 88, 86, 85, 89, 90, 87, 91];
const Status = ['O', 'N', 'I'];
const GPA = ['High', 'Medium', 'Low'];
const College = ['Cyber College ', 'College of Art and Science ', 'College of Education ', 'College of Business '];
const Depth = ['Undergrad'];
const Level = ['Bachelor', 'Associate', 'Master', 'Doctor'];

const allAttributeLists = [Address, Major, Degree, Semester, Y, Status, GPA, College, Depth, Level];
const allTablesStringList = ['Time', 'Status', 'Location', 'Result', 'College'];

/**
 * function to retrieve all possible results from each column attribute
 * @param jsonResult
 * @returns array of all possible column entry
 */
exports.dictionaryMaker = jsonResult => {
  const finalArray = [];
  const parsedObject = JSON.parse(JSON.stringify(jsonResult));

  parsedObject.forEach(element => {
    if (!finalArray.includes(element.Level)) finalArray.push(element.Level);
  });

  return finalArray;
};

// all possible text inputs that might not be in the attribute lists
const possibleTexts = [
  'associate degree',
  'bachelor of science',
  'bachelor of art',
  'master of science',
  'master of art',
  'master of business administration',
  'doctor of education',
  'doctor of philosophy',
  'spring',
  'fall',
  'summer',
  'out of state',
  'none of the above',
  'international',
  'quality',
];

/**
 * text switcher for possible text inputs not in the attribute lists
 * @param  text
 * @returns corresponding attribute field
 */
const textSwitcher = text => {
  switch (text) {
    case 'associate degree':
      return 'AS';
    case 'bachelor of science':
      return 'BS';
    case 'bachelor of art':
      return 'BA';
    case 'master of science':
      return 'MS';
    case 'master of art':
      return 'MA';
    case 'master of business administration':
      return 'MBA';
    case 'doctor of education':
      return 'EdD';
    case 'doctor of philosophy':
      return 'PhD';
    case 'spring':
      return 'S';
    case 'fall':
      return 'F';
    case 'summer':
      return 'Sum1 Sum2 Sum3 Sum4';
    case 'out of state':
      return 'O';
    case 'none of the above':
      return 'N';
    case 'international':
      return 'I';
    case 'quality':
      return 'GPA';
    default:
      return text;
  }
};

// returns query string to join multiple tables
const handleTableJoin = tableList => {
  if (tableList) {
    const joinArray = [`FROM ${tableList[0]}`];
    if (tableList.length > 1)
      tableList.forEach((table, index) => index > 0 && joinArray.push(`JOIN ${table} ON ${tableList[index - 1]}.id = ${table}.id`));
    return joinArray.join('\n');
  } else return '';
};

// returns query WHERE conditionals
const handleQueryConditionals = tableDictionary => {
  if (tableDictionary) {
    const newDictionary = {};
    const joinArray = [];

    for (const table in tableDictionary) {
      tableDictionary[table].map(attribute => (newDictionary[`${[table]}.${Object.keys(attribute)}`] = Object.values(attribute)[0]));
    }

    for (const condition in newDictionary) {
      newDictionary[condition].forEach(param => joinArray.push(`${condition} = "${param}"`));
    }

    console.log('newDictionary', newDictionary);
    console.log('joinArray', joinArray);

    if (joinArray.length > 1) return ` WHERE ` + joinArray.join(`\nAND `);
    else return ` WHERE ` + joinArray.join('');
  } else return '';
};

const OLAPParser = tableDictionary => {
  const allTableRollUps = [];
  const allTableRollDowns = [];
  const allTableDices = [];

  //   Logic to create all Roll ups
  for (const table in tableDictionary) {
    if (table === 'Time' || table === 'College') {
      const tableRollUp = [];

      const attributes = tableDictionary[table].map(attribute => Object.keys(attribute)[0]);

      attributes.forEach(attribute => {
        if (table.toLowerCase() === 'time' && attribute.toLowerCase() !== 'semester') {
          tableRollUp.push(`from Semester to ${attribute}`);
        }

        if (table.toLowerCase() === 'college' && attribute.toLowerCase() !== 'degree') {
          tableRollUp.push(`from Degree to ${attribute}`);
        }
      });

      allTableRollUps.push(`${table}(${tableRollUp.join(' ')})`);
    }
  }

  //   Logic to create all Roll downs
  for (const table in tableDictionary) {
    if (table === 'Time' || table === 'College') {
      const tableRollDown = [];

      const attributes = tableDictionary[table].map(attribute => Object.keys(attribute)[0]);

      attributes.forEach(attribute => {
        if (table.toLowerCase() === 'time' && attribute.toLowerCase() === 'semester') {
          tableRollDown.push(`from Year to ${attribute}`);
        }

        if (table.toLowerCase() === 'college' && attribute.toLowerCase() === 'degree') {
          tableRollDown.push(`from Collge to ${attribute}`);
        }
      });

      allTableRollDowns.push(`${table}(${tableRollDown.join(' ')})`);
    }
  }

  const warehOUSE = {
    table1: [{ attribute1: [{ param1: 'param1' }, { param2: 'param2' }] }, { attribute2: [{ param1: 'param1' }, { param2: 'param2' }] }],
    table: [{ attribute1: [{ param1: 'param1' }, { param2: 'param2' }] }, { attribute2: [{ param1: 'param1' }, { param2: 'param2' }] }],
  };

  //   Logic to create Dices if all the tables/dimensions exist
  const tableKeys = Object.keys(tableDictionary);
  // if (
  //   tableKeys.includes('Location') &&
  //   tableKeys.includes('Time') &&
  //   tableKeys.includes('Result') &&
  //   tableKeys.includes('College') &&
  //   tableKeys.includes('Status')
  // ) {
  for (const table in tableDictionary) {
    const tableAttributes = [];
    const newDictionary = {};

    tableDictionary[table].forEach(attribute => {
      newDictionary[`${[table]}.${Object.keys(attribute)}`] = Object.values(attribute);
    });

    for (const attribute in newDictionary) {
      const allAttributeParams = [Object.values(newDictionary[attribute][0])[0]];

      if (newDictionary[attribute].length > 1)
        newDictionary[attribute].forEach((param, index) => {
          index > 0 && allAttributeParams.push(` or ${Object.values(param)[0]}`);
        });

      tableAttributes.push(allAttributeParams.join(' '));
    }

    tableAttributes.map(stringAttribute => allTableDices.push(`${table}: ${stringAttribute}`));
  }
  // }

  console.log('...roll ups', allTableRollUps.join('\n'));

  console.log('...allTableDices', allTableDices.join('\n'));

  // logic to check slices
  const allSlicesObj = [];
  allTablesStringList.forEach(attribute => {
    const countData = {};
    allTableDices.forEach((dice, index) => {
      if (dice.includes(attribute)) {
        if (countData[attribute]) countData[attribute].push(index);
        else {
          countData[attribute] = [index];
        }
      }

      console.log('...dice', dice);
    });

    console.log('allTableDices', allTableDices);

    console.log('...attribute', attribute);

    if (Object.keys(countData).length > 0) allSlicesObj.push(countData);
  });

  let slicesIndexInDices = [];
  allSlicesObj.forEach(slice => {
    Object.values(slice).forEach(sliceIndex => {
      if (sliceIndex.length > 1) {
        slicesIndexInDices = [...slicesIndexInDices, ...sliceIndex];
      }
    });
  });

  const allStringSlices = [];
  slicesIndexInDices.forEach(sliceIndex => allStringSlices.push(allTableDices[sliceIndex]));

  console.log('...allSlicesObj', allSlicesObj);

  return { rollUps: allTableRollUps.join('\n'), dices: allTableDices.join('\n'), slices: allStringSlices.join('\n') };

  //   Get the number of graduates with a high GPA in the college of business for
  // Spring semesters of 90 and 92 who are out of state in Little Rock
};

/**
 * takes in an array of attribute params and dynamically creates sql query from it
 * @param array of attribute parameters
 * @returns a string of SQL query
 */
const queryWriter = dictionary => {
  const tableDictionary = {};

  for (const attribute in dictionary) {
    switch (attribute) {
      case 'College':
      case 'Depth':
      case 'Degree':
      case 'Level':
      case 'Major':
        if (tableDictionary.College) tableDictionary.College.push({ [attribute]: dictionary[attribute] });
        else tableDictionary['College'] = [{ [attribute]: dictionary[attribute] }];
        break;
      case 'GPA':
        if (tableDictionary.Result) tableDictionary.Result.push({ [attribute]: dictionary[attribute] });
        else tableDictionary['Result'] = [{ [attribute]: dictionary[attribute] }];
        break;
      case 'Y':
      case 'Semester':
        if (tableDictionary.Time) tableDictionary.Time.push({ [attribute]: dictionary[attribute] });
        else tableDictionary['Time'] = [{ [attribute]: dictionary[attribute] }];
        break;
      case 'Address':
        if (tableDictionary.Location) tableDictionary.Location.push({ [attribute]: dictionary[attribute] });
        else tableDictionary['Location'] = [{ [attribute]: dictionary[attribute] }];
        break;
      case 'Status':
        if (tableDictionary.Status) tableDictionary.Status.push({ [attribute]: dictionary[attribute] });
        else tableDictionary['Status'] = [{ [attribute]: dictionary[attribute] }];
    }
  }

  const tablesInQuery = Object.keys(tableDictionary);

  const queryStringInterpolation = ` 
  SELECT COUNT(*)
  ${handleTableJoin(tablesInQuery)}
  ${handleQueryConditionals(tableDictionary)}
`;

  console.log('tableDictionary', tableDictionary);
  console.log('tablesInQuery', tablesInQuery);
  console.log('...queryStringInterpolation', queryStringInterpolation);

  handleQueryConditionals(tableDictionary);
  OLAPParser(tableDictionary);

  return { queryStringInterpolation, OLAP: OLAPParser(tableDictionary) };
};

/**
 * takes in an array of attribute params and dynamically creates a query attribute dictionary
 * @param dictionary of attribute parameters
 * @returns a dictionary
 */
const sqlQueryDictionary = queryList => {
  const queryAndParamDictionary = {};

  queryList.forEach(param => {
    if (Address.includes(param)) {
      if (queryAndParamDictionary.Address) queryAndParamDictionary.Address.push(param);
      else {
        queryAndParamDictionary['Address'] = [param];
      }
    }
    if (Major.includes(param)) {
      if (queryAndParamDictionary.Major) queryAndParamDictionary.Major.push(param);
      else {
        queryAndParamDictionary['Major'] = [param];
      }
    }
    if (Degree.includes(param)) {
      if (queryAndParamDictionary.Degree) queryAndParamDictionary.Degree.push(param);
      else {
        queryAndParamDictionary['Degree'] = [param];
      }
    }
    if (Semester.includes(param)) {
      if (queryAndParamDictionary.Semester) queryAndParamDictionary.Semester.push(param);
      else {
        queryAndParamDictionary['Semester'] = [param];
      }
    }
    if (Y.includes(param)) {
      if (queryAndParamDictionary.Y) queryAndParamDictionary.Y.push(param);
      else {
        queryAndParamDictionary['Y'] = [param];
      }
    }
    if (Status.includes(param)) {
      if (queryAndParamDictionary.Status) queryAndParamDictionary.Status.push(param);
      else {
        queryAndParamDictionary['Status'] = [param];
      }
    }
    if (GPA.includes(param)) {
      if (queryAndParamDictionary.GPA) queryAndParamDictionary.GPA.push(param);
      else {
        queryAndParamDictionary['GPA'] = [param];
      }
    }
    if (College.includes(param)) {
      if (queryAndParamDictionary.College) queryAndParamDictionary.College.push(param);
      else {
        queryAndParamDictionary['College'] = [param];
      }
    }
    if (Depth.includes(param)) {
      if (queryAndParamDictionary.Depth) queryAndParamDictionary.Depth.push(param);
      else {
        queryAndParamDictionary['Depth'] = [param];
      }
    }
    if (Level.includes(param)) {
      if (queryAndParamDictionary.Level) queryAndParamDictionary.Level.push(param);
      else {
        queryAndParamDictionary['Level'] = [param];
      }
    }
  });

  console.log('...queryAndParamDictionary finale', queryAndParamDictionary);

  return queryWriter(queryAndParamDictionary);
};

/**
 * takes in the input text and parses it to return sql query
 * @param inputText
 * @return sql query string
 */
exports.inputParser = inputText => {
  const switchedPossibleTexts = [];

  //   convert input text to lower case
  const lowCaseText = inputText.toLowerCase();

  const newLowCaseText = lowCaseText.includes('summer') ? lowCaseText.replace('summer', 'sum1 sum2 sum3 sum4') : lowCaseText;

  console.log('*********newLowCaseText', newLowCaseText);
  //   check if lower case input text is amongst the possible text list
  const possibleTextsChecker = possibleTexts.filter(char => newLowCaseText.includes(char));
  console.log('...possibleTextsChecker', possibleTextsChecker);

  if (possibleTextsChecker.length > 0) possibleTextsChecker.map(text => switchedPossibleTexts.push(textSwitcher(text)));

  console.log('...switchedPossibleTexts 1', switchedPossibleTexts);

  //   check if lower case input text is amongst the lists of allAttributes and push it into the
  //   array of switchedPossibleTexts
  allAttributeLists.forEach(attribute =>
    attribute.forEach(char => {
      const charType = typeof char;
      const isCharSingleOrDoubleString = char.length === 1 || char.length === 2;

      newLowCaseText.includes(
        charType === 'string' ? (isCharSingleOrDoubleString ? ` ${char.toLowerCase()} ` : char.toLowerCase()) : char
      ) && switchedPossibleTexts.push(char);
    })
  );

  console.log('...switchedPossibleTexts 2', switchedPossibleTexts);

  return sqlQueryDictionary(switchedPossibleTexts);
};
