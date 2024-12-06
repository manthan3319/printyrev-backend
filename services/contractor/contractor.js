/**
 * This is for Contain function layer for contractor service.
 * @author Manthan Vaghasiya
 *
 */

const ObjectId = require("mongodb").ObjectID;
const dbService = require("../../utilities/dbService");

/*************************** addContractor ***************************/
const addContractor = async (req, mainUserId, createdBy) => {
  const { email } = req.body;

  let contractorData = await dbService.findOneRecord("contractorModel", {
    email: email,
  });
  if (contractorData) {
    throw new Error("Email Address Already Exists!");
  } else {
    let project = await dbService.createOneRecord("contractorModel", req.body);

    return "data inserted";
  }
};

/*************************** getcontractors ***************************/
const getcontractor = async (req, mainUserId, createdBy) => {
  let postData = req.body;
  let { page = 1, limit = 0 } = req.body;
  let skiprecord = limit * page - limit;
  let ctype = postData.contractorType;
  let where = {
    mainUserId: ObjectId(mainUserId),
    isDeleted: false,
  };
  if (ctype && ctype.length) {
    where["contractorType"] = { $in: postData.contractorType };
  }

  if (postData.searchText) {
    // where["firstName"] = { $regex: postData.searchText, $options: "i" };
    //where["lastName"] =  { $regex: postData.searchText, $options: "i" };
    where = {
      ...where,
      ...{
        $or: [
          { firstName: { $regex: postData.searchText, $options: "i" } },
          { lastName: { $regex: postData.searchText, $options: "i" } },
          { companyName: { $regex: postData.searchText, $options: "i" } },
        ],
      },
    };
  }

  let sort = {};

  if (postData.sortBy && postData.sortMode) {
    if (postData.sortBy == "fullName") {
      sort["firstName"] = postData.sortMode;
    } else {
      sort[postData.sortBy] = postData.sortMode;
    }
  } else {
    sort["createdAt"] = -1;
  }

  let totalrecord = await contractorModel.findWithCount(
    "contractorModel",
    where
  );
  var results = await contractorModel.findOrderWithSort(
    "contractorModel",
    where,
    sort,
    skiprecord,
    limit
  );
  var result = JSON.parse(JSON.stringify(results));
  if (result.length !== 0) {
    for (let i = 0; i < result.length; i++) {
      Object.assign(result[i], {
        fullName: result[i].firstName + " " + result[i].lastName,
      });
    }
  }
  return {
    status: "Success",
    message: "all Contractor fetched successfully.",
    items: result,
    page: page,
    count: totalrecord,
    limit: limit,
  };
  // } else {
  //   throw new Error("Contractor Not found");
  // }
};

/*************************** getcontractorwithid ***************************/
const getcontractorwithid = async (req, mainUserId, createdBy) => {
  let fileCount = 0;
  let where = {
    _id: req.body.id,
    mainUserId: ObjectId(mainUserId),
    isDeleted: false,
  };
  let result = await contractorModel.findOneQuery("contractorModel", where);
  if (result) {
    let folderAggregateQuery = [
      { $match: { isDeleted: false, subModuleId: result._id } },
      // {
      //   $lookup: {
      //     from: "files",
      //     let: { folderId: "$_id" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: { $eq: ["$folderId", "$$folderId"] },
      //           isDeleted: false,
      //         },
      //       },
      //     ],
      //     as: "fileData",
      //   },
      // },
      // {
      //   $group: {
      //     _id: null,
      //     fileCount: {
      //       $sum: {
      //         $size: "$fileData",
      //       },
      //     },
      //   },
      // },
    ];
    // [[{ fileCount = 0 } = {}]] = await Promise.all([
    //   await FolderModel.aggregateData(folderAggregateQuery),
    // ]);
    return { result, fileCount };
  } else {
    return { result, fileCount };
  }
};

/*************************** deletecontractor ***************************/
const deletecontractor = async (req, mainUserId, createdBy) => {
  let cid = req.body.id;

  let where = {};
  where["_id"] = cid;
  where["mainUserId"] = ObjectId(mainUserId);
  let contractordata = await contractorModel.findByConditionAndUpdate(
    "contractorModel",
    where,
    {
      isDeleted: true,
    }
  );
  return "contractor data updated";
};

/*************************** updatecontractor ***************************/
const updatecontractor = async (req, mainUserId, createdBy) => {
  req.body["updatedAt"] = new Date();
  if (req.body.email == "" || !req.body.email) {
    let project = await contractorModel.findByConditionAndUpdate(
      "contractorModel",
      { _id: ObjectId(req.query.id) },
      req.body
    );
    return "data updated";
  } else {
    let contractorData = await contractorModel.findOneQuery("contractorModel", {
      _id: { $ne: ObjectId(req.query.id) },
      email: req.body.email,
    });
    if (contractorData) {
      throw new Error("Email Address Already Exists!");
    } else {
      let project = await contractorModel.findByConditionAndUpdate(
        "contractorModel",
        { _id: ObjectId(req.query.id) },
        req.body
      );
      return project;
    }
  }
};

module.exports = {
  addContractor,
  getcontractor,
  getcontractorwithid,
  deletecontractor,
  updatecontractor,
};
