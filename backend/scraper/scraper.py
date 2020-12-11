import pandas as pd
import json
import os

files = [
    "0_3000", 
    "3001_6001", 
    "6001_9001", 
    "9001_12001", 
    "12001_15001", 
    "15001_18001", 
    "18001_21001", 
    "21001_24001", 
    "24001_27001", 
    "27001_end"
]



with open("godata.txt", 'w'):
    dfs = []
    for f in files:
        with open("resources/" + f + ".html") as htmlfile:
            df = pd.read_html(htmlfile)
            df = df[0].dropna(axis=1)
            df = df.rename(columns={
                "Short Link": "goLink",
                "URL": "url",
                "Usage Count": "usageCount",
            })
            df = df.drop("Owner", axis=1)
            df["goLink"] = df["goLink"].str.replace("\s*\(public\)", "")
            dfs.append(df)
    maindf = pd.concat(dfs)
    print(maindf)
    # print(maindf.head(10))
    # print(maindf.size)
    result = maindf.to_json(orient="records")
    parsed = json.loads(result)
    with open("golinks.json", "w") as jsonout:
        json.dump(parsed, jsonout)
